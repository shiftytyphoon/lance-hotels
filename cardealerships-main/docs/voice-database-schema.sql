-- =====================================================================
-- Voice Stack Database Schema (Supabase/PostgreSQL)
-- =====================================================================
--
-- This schema supports the edge-first streaming voice architecture.
-- Tables are optimized for:
-- - Fast inserts during real-time conversations
-- - Efficient querying for analytics and debugging
-- - Minimal joins (denormalized where needed for performance)
--
-- Run this migration in Supabase SQL Editor or via CLI:
-- supabase db push
-- =====================================================================

-- ─────────────────────────────────────────────────────────────────────
-- 1. Conversations (Call-level metadata)
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE conversation_channel AS ENUM ('web', 'phone', 'demo');
CREATE TYPE conversation_phase AS ENUM (
  'greeting',
  'listening',
  'thinking',
  'speaking',
  'transferring',
  'ended'
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,

  channel conversation_channel NOT NULL,
  phase conversation_phase NOT NULL DEFAULT 'greeting',

  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER GENERATED ALWAYS AS (
    EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))::INTEGER
  ) STORED,

  -- Channel-specific metadata
  user_phone TEXT,  -- For telephony (E.164 format: +1234567890)
  twilio_call_sid TEXT,
  browser_user_agent TEXT,
  ip_address INET,

  -- Metrics (computed from utterances, cached here for performance)
  total_utterances INTEGER DEFAULT 0,
  user_utterances INTEGER DEFAULT 0,
  assistant_utterances INTEGER DEFAULT 0,
  total_interruptions INTEGER DEFAULT 0,  -- How many times user barged in

  -- Quality scores (computed post-call)
  avg_response_latency_ms INTEGER,
  sentiment_score DECIMAL(3,2),  -- -1.0 (negative) to +1.0 (positive)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_conversations_hotel_id ON conversations(hotel_id);
CREATE INDEX idx_conversations_started_at ON conversations(started_at DESC);
CREATE INDEX idx_conversations_channel ON conversations(channel);
CREATE INDEX idx_conversations_phone ON conversations(user_phone) WHERE user_phone IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Utterances (Individual speech turns)
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE utterance_role AS ENUM ('user', 'assistant', 'system');

CREATE TABLE utterances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  role utterance_role NOT NULL,
  text TEXT NOT NULL,
  audio_url TEXT,  -- S3/Supabase Storage URL (optional, for playback/training)

  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_ms INTEGER GENERATED ALWAYS AS (
    EXTRACT(MILLISECONDS FROM (ended_at - started_at))::INTEGER
  ) STORED,

  is_final BOOLEAN NOT NULL DEFAULT TRUE,
  confidence DECIMAL(4,3),  -- ASR confidence (0.000 - 1.000)

  -- Provider metadata
  asr_model TEXT,  -- e.g., "deepgram-nova-2"
  tts_voice_id TEXT,  -- e.g., "cartesia-conversational-1"
  interrupted BOOLEAN DEFAULT FALSE,  -- True if user barged in during this

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_utterances_conversation ON utterances(conversation_id, started_at);
CREATE INDEX idx_utterances_role ON utterances(conversation_id, role);
CREATE INDEX idx_utterances_interrupted ON utterances(conversation_id) WHERE interrupted = TRUE;

-- Trigger to update conversation stats
CREATE OR REPLACE FUNCTION update_conversation_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET
    total_utterances = total_utterances + 1,
    user_utterances = user_utterances + CASE WHEN NEW.role = 'user' THEN 1 ELSE 0 END,
    assistant_utterances = assistant_utterances + CASE WHEN NEW.role = 'assistant' THEN 1 ELSE 0 END,
    total_interruptions = total_interruptions + CASE WHEN NEW.interrupted THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER utterance_stats_update
AFTER INSERT ON utterances
FOR EACH ROW
EXECUTE FUNCTION update_conversation_stats();

-- ─────────────────────────────────────────────────────────────────────
-- 3. Intents (Extracted from user utterances)
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE intent_type AS ENUM (
  -- Booking
  'book_room',
  'modify_reservation',
  'cancel_reservation',
  'check_availability',

  -- Information
  'ask_amenities',
  'ask_hours',
  'ask_location',
  'ask_pricing',
  'ask_policies',

  -- Support
  'report_issue',
  'request_service',
  'transfer_to_human',

  -- Meta
  'greeting',
  'farewell',
  'unclear',
  'off_topic'
);

CREATE TABLE intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utterance_id UUID NOT NULL REFERENCES utterances(id) ON DELETE CASCADE,

  type intent_type NOT NULL,
  confidence DECIMAL(4,3) NOT NULL,  -- 0.000 - 1.000

  -- Extracted entities (JSON for flexibility)
  entities JSONB DEFAULT '{}'::JSONB,
  -- Example: {"check_in_date": "2025-01-15", "guests": 2, "room_type": "deluxe"}

  extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used TEXT NOT NULL,  -- e.g., "claude-haiku-20250101"
  latency_ms INTEGER NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intents_utterance ON intents(utterance_id);
CREATE INDEX idx_intents_type ON intents(type);
CREATE INDEX idx_intents_entities ON intents USING GIN(entities);  -- Fast JSONB queries

-- ─────────────────────────────────────────────────────────────────────
-- 4. Tone Analyses (Emotion & sentiment detection)
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE tone_emotion AS ENUM (
  'neutral',
  'happy',
  'frustrated',
  'confused',
  'urgent',
  'angry',
  'grateful',
  'anxious'
);

CREATE TYPE tone_sentiment AS ENUM ('positive', 'neutral', 'negative');

CREATE TABLE tone_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  utterance_id UUID NOT NULL REFERENCES utterances(id) ON DELETE CASCADE,

  emotion tone_emotion NOT NULL,
  sentiment tone_sentiment NOT NULL,

  urgency_score DECIMAL(3,2) NOT NULL CHECK (urgency_score >= 0 AND urgency_score <= 1),
  politeness_score DECIMAL(3,2) CHECK (politeness_score >= 0 AND politeness_score <= 1),
  confidence DECIMAL(4,3) NOT NULL,

  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tone_utterance ON tone_analyses(utterance_id);
CREATE INDEX idx_tone_emotion ON tone_analyses(emotion);
CREATE INDEX idx_tone_sentiment ON tone_analyses(sentiment);

-- ─────────────────────────────────────────────────────────────────────
-- 5. LLM Decisions (Dialogue generation)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE llm_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  utterance_id UUID NOT NULL REFERENCES utterances(id) ON DELETE CASCADE,  -- User utterance that triggered this

  prompt TEXT NOT NULL,  -- Full prompt sent to LLM (for debugging/training)
  response TEXT NOT NULL,  -- Generated response

  model TEXT NOT NULL,  -- e.g., "claude-sonnet-4.5-20250929"
  temperature DECIMAL(3,2) NOT NULL,
  max_tokens INTEGER NOT NULL,
  stop_sequences TEXT[],

  -- Function calling (if applicable)
  function_calls JSONB,
  -- Example: [{"name": "check_availability", "args": {...}, "result": {...}}]

  reasoning TEXT,  -- Extended thinking (if model supports it)

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  latency_ms INTEGER NOT NULL,  -- Time to first token
  total_tokens INTEGER NOT NULL,

  -- Streaming metrics
  stream_latency_p50 INTEGER,  -- Median inter-token latency
  stream_latency_p99 INTEGER
);

CREATE INDEX idx_llm_conversation ON llm_decisions(conversation_id, created_at);
CREATE INDEX idx_llm_utterance ON llm_decisions(utterance_id);
CREATE INDEX idx_llm_model ON llm_decisions(model);

-- ─────────────────────────────────────────────────────────────────────
-- 6. TTS Plans (Text-to-speech synthesis metadata)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE tts_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  llm_decision_id UUID NOT NULL REFERENCES llm_decisions(id) ON DELETE CASCADE,

  text TEXT NOT NULL,  -- Text to synthesize
  voice_id TEXT NOT NULL,  -- Provider voice ID

  -- Prosody configuration (JSON for flexibility)
  prosody_hints JSONB DEFAULT '{}'::JSONB,
  -- Example: {
  --   "speed": 1.1,
  --   "pitch_shift": 0,
  --   "emotion": "empathetic",
  --   "emphasis": ["important", "urgent"],
  --   "pauses": [{"after_word": "however", "duration_ms": 300}]
  -- }

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  synthesized_at TIMESTAMPTZ,
  audio_url TEXT,  -- Final audio file (for caching/playback)
  latency_ms INTEGER,  -- Time to first audio chunk

  provider TEXT NOT NULL  -- e.g., "cartesia", "elevenlabs"
);

CREATE INDEX idx_tts_llm_decision ON tts_plans(llm_decision_id);
CREATE INDEX idx_tts_voice ON tts_plans(voice_id);

-- ─────────────────────────────────────────────────────────────────────
-- 7. Performance Metrics (Aggregated for dashboards)
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Latency breakdown (all in milliseconds)
  vad_latency INTEGER,
  asr_latency INTEGER,
  intent_latency INTEGER,
  tone_latency INTEGER,
  llm_latency INTEGER,  -- First token
  tts_latency INTEGER,  -- First audio chunk
  total_latency INTEGER,  -- User stopped speaking → assistant audio played

  -- Quality metrics
  asr_confidence_avg DECIMAL(4,3),
  intent_confidence_avg DECIMAL(4,3),
  tone_confidence_avg DECIMAL(4,3),

  interruption_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,

  measured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_metrics_conversation ON performance_metrics(conversation_id);
CREATE INDEX idx_metrics_measured_at ON performance_metrics(measured_at DESC);

-- ─────────────────────────────────────────────────────────────────────
-- 8. Error Logs (Debugging & monitoring)
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE error_severity AS ENUM ('debug', 'info', 'warning', 'error', 'critical');

CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,

  severity error_severity NOT NULL,
  component TEXT NOT NULL,  -- e.g., "vad", "asr", "llm", "tts", "websocket"
  message TEXT NOT NULL,
  stack_trace TEXT,

  metadata JSONB DEFAULT '{}'::JSONB,
  -- Example: {"provider": "deepgram", "status_code": 429, "retry_count": 3}

  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_errors_conversation ON error_logs(conversation_id);
CREATE INDEX idx_errors_severity ON error_logs(severity, occurred_at DESC);
CREATE INDEX idx_errors_component ON error_logs(component);

-- ─────────────────────────────────────────────────────────────────────
-- 9. Useful Views for Analytics
-- ─────────────────────────────────────────────────────────────────────

-- Average latencies by hotel
CREATE VIEW hotel_performance_summary AS
SELECT
  h.id AS hotel_id,
  h.name AS hotel_name,
  COUNT(DISTINCT c.id) AS total_conversations,
  AVG(c.duration_seconds) AS avg_call_duration_sec,
  AVG(c.avg_response_latency_ms) AS avg_response_latency_ms,
  AVG(c.sentiment_score) AS avg_sentiment,
  SUM(c.total_interruptions) AS total_interruptions
FROM hotels h
LEFT JOIN conversations c ON c.hotel_id = h.id
WHERE c.ended_at IS NOT NULL
GROUP BY h.id, h.name;

-- Intent distribution
CREATE VIEW intent_distribution AS
SELECT
  i.type,
  COUNT(*) AS count,
  AVG(i.confidence) AS avg_confidence,
  AVG(i.latency_ms) AS avg_latency_ms
FROM intents i
GROUP BY i.type
ORDER BY count DESC;

-- Tone/emotion trends
CREATE VIEW emotion_distribution AS
SELECT
  t.emotion,
  t.sentiment,
  COUNT(*) AS count,
  AVG(t.urgency_score) AS avg_urgency,
  AVG(t.politeness_score) AS avg_politeness
FROM tone_analyses t
GROUP BY t.emotion, t.sentiment
ORDER BY count DESC;

-- ─────────────────────────────────────────────────────────────────────
-- 10. Row-Level Security (RLS) Policies
-- ─────────────────────────────────────────────────────────────────────

-- Enable RLS on all tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE utterances ENABLE ROW LEVEL SECURITY;
ALTER TABLE intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tone_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tts_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Example: Users can only see conversations for their hotels
-- (Assumes you have a user_hotel_access table or similar)
CREATE POLICY "Users see own hotel conversations" ON conversations
FOR SELECT
USING (
  hotel_id IN (
    SELECT hotel_id FROM user_hotel_access
    WHERE user_id = auth.uid()
  )
);

-- Service role has full access (for Edge Functions)
CREATE POLICY "Service role full access" ON conversations
FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Repeat for other tables...
-- (Add similar policies as needed for your auth model)

-- ─────────────────────────────────────────────────────────────────────
-- 11. Helper Functions
-- ─────────────────────────────────────────────────────────────────────

-- Calculate end-to-end latency for a conversation turn
CREATE OR REPLACE FUNCTION calculate_turn_latency(
  p_utterance_id UUID
)
RETURNS TABLE (
  user_stopped_at TIMESTAMPTZ,
  assistant_started_at TIMESTAMPTZ,
  latency_ms INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.ended_at AS user_stopped_at,
    a.started_at AS assistant_started_at,
    EXTRACT(MILLISECONDS FROM (a.started_at - u.ended_at))::INTEGER AS latency_ms
  FROM utterances u
  CROSS JOIN LATERAL (
    SELECT started_at
    FROM utterances
    WHERE conversation_id = u.conversation_id
      AND role = 'assistant'
      AND started_at > u.ended_at
    ORDER BY started_at ASC
    LIMIT 1
  ) a
  WHERE u.id = p_utterance_id AND u.role = 'user';
END;
$$ LANGUAGE plpgsql;

-- Get conversation transcript (ordered)
CREATE OR REPLACE FUNCTION get_conversation_transcript(
  p_conversation_id UUID
)
RETURNS TABLE (
  role utterance_role,
  text TEXT,
  started_at TIMESTAMPTZ,
  emotion tone_emotion,
  intent intent_type
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.role,
    u.text,
    u.started_at,
    t.emotion,
    i.type AS intent
  FROM utterances u
  LEFT JOIN tone_analyses t ON t.utterance_id = u.id
  LEFT JOIN intents i ON i.utterance_id = u.id
  WHERE u.conversation_id = p_conversation_id
  ORDER BY u.started_at ASC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================================
-- End of Schema
-- =====================================================================
