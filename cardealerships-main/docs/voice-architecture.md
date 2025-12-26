# Voice Architecture Design: Edge-First Streaming

**Status:** Design Proposal
**Last Updated:** 2025-12-25
**Target Latency:** <200ms first-word (optimized), <300ms (realistic)
**Channels:** Web (browser) + Telephony (Twilio)

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Data Models](#2-data-models)
3. [Sequence Diagrams](#3-sequence-diagrams)
4. [Component Design](#4-component-design)
5. [Migration Path](#5-migration-path)
6. [Performance Targets](#6-performance-targets)

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Client Layer                                                       │
│  ┌──────────────────┐              ┌──────────────────┐            │
│  │  Browser Client  │              │  Twilio Phone    │            │
│  │  - WebRTC audio  │              │  - Media Streams │            │
│  │  - React UI      │              │  - PSTN gateway  │            │
│  └────────┬─────────┘              └────────┬─────────┘            │
└───────────┼──────────────────────────────────┼──────────────────────┘
            │ WebSocket (binary audio)         │
            │ ws://your-domain/voice           │
            └──────────────┬───────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────────────────┐
│  Edge Orchestration Layer (Vercel Edge Functions)                  │
│  ┌──────────────────────┴─────────────────────────────────────┐   │
│  │  /api/voice/stream (WebSocket handler)                     │   │
│  │  - Audio I/O multiplexing                                  │   │
│  │  - Per-call state management                               │   │
│  │  - Error recovery + reconnection                           │   │
│  └──────────────────────┬─────────────────────────────────────┘   │
│                         │                                          │
│  ┌──────────────────────┴─────────────────────────────────────┐   │
│  │  Voice Pipeline Orchestrator                               │   │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ VAD + Barge-in  │→ │ ASR Stream   │→ │ Intent/Tone  │  │   │
│  │  │ (Silero ONNX)   │  │ (Deepgram)   │  │ (GPT-4o mini)│  │   │
│  │  └─────────────────┘  └──────────────┘  └──────────────┘  │   │
│  │           ↓                                      ↓          │   │
│  │  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │ Audio Queue     │← │ TTS Stream   │← │ Dialogue Mgr │  │   │
│  │  │ (flush on int.) │  │ (Cartesia)   │  │ (GPT-4o)     │  │   │
│  │  └─────────────────┘  └──────────────┘  └──────────────┘  │   │
│  └────────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│  Data Layer (Supabase)     │                                        │
│  ┌─────────────────────────┴───────────────────────────────────┐   │
│  │  Tables:                                                     │   │
│  │  - conversations (call metadata, hotel_id, channel)         │   │
│  │  - utterances (text, audio_url, role, timestamps)           │   │
│  │  - intents (type, confidence, entities)                     │   │
│  │  - tone_analyses (emotion, urgency, sentiment)              │   │
│  │  - llm_decisions (prompt, response, model, latency)         │   │
│  │  - tts_plans (text, prosody_hints, voice_id)                │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  External Services                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │  Deepgram    │  │  Cartesia    │  │  OpenAI      │             │
│  │  Nova 2 STT  │  │  Sonic TTS   │  │  GPT-4o API  │             │
│  │  WebSocket   │  │  WebSocket   │  │  Streaming   │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                     │
│  Optional: Anthropic Claude (alternative LLM provider)              │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Design Principles

1. **Streaming-first:** No blocking waits—ASR, LLM, TTS all stream
2. **Parallel processing:** Intent + tone run concurrently with dialogue generation
3. **Adaptive buffering:** Queue audio chunks, flush on barge-in
4. **Stateful per-call:** Each conversation has its own state machine
5. **Graceful degradation:** Fallback to simpler responses if LLM times out

---

## 2. Data Models

### 2.1 Core Types (TypeScript)

```typescript
// ─────────────────────────────────────────────────────────────────────
// Conversation & Call State
// ─────────────────────────────────────────────────────────────────────

enum ConversationChannel {
  WEB = 'web',
  PHONE = 'phone',
  DEMO = 'demo',
}

enum ConversationPhase {
  GREETING = 'greeting',          // "Hello! How can I help?"
  LISTENING = 'listening',         // Waiting for user input
  THINKING = 'thinking',           // Processing intent + generating response
  SPEAKING = 'speaking',           // Playing TTS
  TRANSFERRING = 'transferring',   // Handoff to human
  ENDED = 'ended',
}

interface Conversation {
  id: string;                      // UUID
  hotel_id: string;                // Foreign key to hotels table
  channel: ConversationChannel;
  phase: ConversationPhase;
  started_at: Date;
  ended_at: Date | null;
  duration_seconds: number | null;
  user_phone?: string;             // For telephony
  metadata: {
    twilio_call_sid?: string;
    browser_user_agent?: string;
    ip_address?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Audio & Transcription
// ─────────────────────────────────────────────────────────────────────

enum UtteranceRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',               // e.g., "Call transferred to front desk"
}

interface Utterance {
  id: string;
  conversation_id: string;
  role: UtteranceRole;
  text: string;                    // Final transcript
  audio_url?: string;              // S3/Supabase Storage URL (optional)
  started_at: Date;
  ended_at: Date;
  duration_ms: number;
  is_final: boolean;               // False for interim ASR results
  confidence?: number;             // ASR confidence (0-1)
  metadata: {
    asr_model?: string;            // e.g., "deepgram-nova-2"
    tts_voice_id?: string;         // e.g., "cartesia-conversational-1"
    interrupted?: boolean;         // True if user barged in
  };
}

// ─────────────────────────────────────────────────────────────────────
// Intent & Tone
// ─────────────────────────────────────────────────────────────────────

enum IntentType {
  // Booking
  BOOK_ROOM = 'book_room',
  MODIFY_RESERVATION = 'modify_reservation',
  CANCEL_RESERVATION = 'cancel_reservation',
  CHECK_AVAILABILITY = 'check_availability',

  // Information
  ASK_AMENITIES = 'ask_amenities',
  ASK_HOURS = 'ask_hours',
  ASK_LOCATION = 'ask_location',
  ASK_PRICING = 'ask_pricing',

  // Support
  REPORT_ISSUE = 'report_issue',
  REQUEST_SERVICE = 'request_service',
  TRANSFER_TO_HUMAN = 'transfer_to_human',

  // Meta
  GREETING = 'greeting',
  FAREWELL = 'farewell',
  UNCLEAR = 'unclear',
}

interface Intent {
  id: string;
  utterance_id: string;
  type: IntentType;
  confidence: number;              // 0-1
  entities: Record<string, any>;   // Extracted entities
  // Examples:
  // { "check_in_date": "2025-01-15", "check_out_date": "2025-01-18", "guests": 2 }
  // { "amenity": "pool", "location": "rooftop" }
  extracted_at: Date;
  model_used: string;              // e.g., "claude-haiku-20250101"
  latency_ms: number;
}

enum ToneEmotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  FRUSTRATED = 'frustrated',
  CONFUSED = 'confused',
  URGENT = 'urgent',
  ANGRY = 'angry',
  GRATEFUL = 'grateful',
}

enum ToneSentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

interface Tone {
  id: string;
  utterance_id: string;
  emotion: ToneEmotion;
  sentiment: ToneSentiment;
  urgency_score: number;           // 0-1 (0=casual, 1=emergency)
  politeness_score: number;        // 0-1
  confidence: number;              // Model confidence
  detected_at: Date;
  model_used: string;
  latency_ms: number;
}

// ─────────────────────────────────────────────────────────────────────
// LLM Decision
// ─────────────────────────────────────────────────────────────────────

interface LLMDecision {
  id: string;
  conversation_id: string;
  utterance_id: string;            // User utterance that triggered this
  prompt: string;                  // Full prompt sent to LLM
  response: string;                // Generated text
  model: string;                   // e.g., "claude-sonnet-4.5"
  temperature: number;
  max_tokens: number;
  stop_sequences?: string[];
  function_calls?: FunctionCall[]; // If using tool use
  reasoning?: string;              // If model supports reasoning tokens
  created_at: Date;
  latency_ms: number;              // Time to first token
  total_tokens: number;
  metadata: {
    stream_latency_p50?: number;   // Median token latency
    stream_latency_p99?: number;
  };
}

interface FunctionCall {
  name: string;                    // e.g., "check_room_availability"
  arguments: Record<string, any>;
  result: any;
  executed_at: Date;
}

// ─────────────────────────────────────────────────────────────────────
// TTS Plan
// ─────────────────────────────────────────────────────────────────────

interface TTSPlan {
  id: string;
  llm_decision_id: string;
  text: string;                    // Text to synthesize
  voice_id: string;                // Cartesia/ElevenLabs voice
  prosody_hints: ProsodyHints;
  created_at: Date;
  synthesized_at: Date | null;
  audio_url?: string;              // Final audio file (for caching)
  latency_ms?: number;             // Time to first audio chunk
}

interface ProsodyHints {
  speed: number;                   // 0.8-1.2 (1.0 = normal)
  pitch_shift?: number;            // -12 to +12 semitones
  emotion?: ToneEmotion;           // Match user's tone or contrast
  emphasis?: string[];             // Words to emphasize
  pauses?: PauseHint[];            // Strategic pauses for clarity
}

interface PauseHint {
  after_word: string;              // Word to pause after
  duration_ms: number;             // Pause length (100-500ms)
}

// ─────────────────────────────────────────────────────────────────────
// Real-time State (in-memory, not persisted)
// ─────────────────────────────────────────────────────────────────────

interface ConversationState {
  conversation_id: string;
  phase: ConversationPhase;

  // Audio streams
  asr_connection: WebSocket | null;
  tts_connection: WebSocket | null;

  // Buffers
  audio_queue: AudioChunk[];       // Outgoing TTS audio
  partial_transcript: string;      // Interim ASR results

  // Barge-in tracking
  user_speaking: boolean;
  assistant_speaking: boolean;
  last_user_speech_at: Date | null;
  last_vad_detection_at: Date | null;

  // Conversation history (for LLM context)
  history: ConversationMessage[];

  // Hotel context
  hotel_id: string;
  hotel_data: {
    name: string;
    amenities: string[];
    policies: Record<string, any>;
  };
}

interface AudioChunk {
  id: string;
  data: Buffer;                    // Raw audio bytes
  format: 'pcm16' | 'opus' | 'mp3';
  sample_rate: number;
  channels: number;
  timestamp: Date;
  flushed: boolean;                // True if barge-in canceled this
}

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: IntentType;
  tone?: ToneEmotion;
  timestamp: Date;
}
```

---

## 3. Sequence Diagrams

### 3.1 Happy Path: User Question → Assistant Response

```
User Browser    Edge WS Handler    VAD/ASR         Intent/Tone    Dialogue LLM    TTS Stream      Supabase
     │                │                │                │              │              │              │
     │ ─ speak ────→  │                │                │              │              │              │
     │                │ ─ audio ────→  │                │              │              │              │
     │                │                │                │              │              │              │
     │                │  ← VAD: start  │                │              │              │              │
     │                │                │                │              │              │              │
     │ (speaking...)  │ ─ stream ───→  │                │              │              │              │
     │                │                │                │              │              │              │
     │ ─ silence ──→  │                │                │              │              │              │
     │                │  ← VAD: end ─  │                │              │              │              │
     │                │  ← transcript  │                │              │              │              │
     │                │                │                │              │              │              │
     │                │ ─────────────────→ classify ──→  │              │              │              │
     │                │ ───────────────────────────────→ generate ───→ │              │              │
     │                │                │  ← intent/tone │              │              │              │
     │                │                │                │  ← stream ─  │              │              │
     │                │                │                │   (tokens)   │              │              │
     │                │ ─────────────────────────────────────────────→ synthesize ─→  │              │
     │                │                │                │              │  ← audio ──  │              │
     │  ← play audio  │                │                │              │   (chunks)   │              │
     │                │                │                │              │              │              │
     │                │ ──────────────────────────────────────────────────────────────→ save all ─→  │
     │                │                │                │              │              │              │
```

**Timeline (target latencies):**
- `T+0ms`: User stops speaking
- `T+10ms`: VAD detects silence
- `T+90ms`: ASR finalizes transcript → save Utterance (interim)
- `T+100ms`: Intent/Tone classification starts (parallel)
- `T+100ms`: Dialogue LLM generation starts (parallel)
- `T+180ms`: Intent/Tone results ready → save Intent + Tone
- `T+250ms`: LLM first token arrives → TTS starts
- `T+330ms`: TTS first audio chunk ready
- `T+380ms`: Audio plays in browser (**first-word latency: 380ms**)

---

### 3.2 Barge-in: User Interrupts Assistant

```
User Browser    Edge WS Handler    VAD             TTS Stream      Audio Queue
     │                │              │                 │                │
     │                │ ── playing → │                 │  ← chunk 1 ── │
     │                │              │                 │  ← chunk 2 ── │
     │  (assistant speaking audio)   │                 │  ← chunk 3 ── │
     │                │              │                 │                │
     │ ─ speak! ───→  │              │                 │                │
     │                │ ── audio ──→ │                 │                │
     │                │ ← VAD: START │                 │                │
     │                │              │                 │                │
     │                │ ── STOP TTS ──────────────────→ │                │
     │                │ ── FLUSH QUEUE ─────────────────────────────→   │
     │                │              │  ← canceled  ── │  (chunks 2-3   │
     │                │              │                 │   discarded)   │
     │  ← audio stops │              │                 │                │
     │                │              │                 │                │
     │                │ ── stream new input to ASR ──→ │                │
     │                │              │                 │                │
```

**Key implementation details:**
1. VAD detects user speech **before** ASR confirms transcript
2. Immediately send `CANCEL_TTS` event to TTS WebSocket
3. Flush audio queue on client (stop `AudioContext` playback)
4. Mark interrupted utterance in DB: `metadata.interrupted = true`
5. Continue listening without losing audio stream

---

### 3.3 Telephony (Twilio) Flow

```
PSTN Phone    Twilio       Edge WS Handler    (same pipeline as web)
     │            │                │
     │ ── call ─→ │                │
     │            │ ← TwiML with   │
     │            │   <Stream> ──→ │  (WebSocket URL)
     │            │                │
     │            │ ─── connect ──→│
     │            │                │  (Twilio sends µ-law audio)
     │ ─ speak ─→ │ ─── audio ───→ │ ─→ (transcode to PCM16)
     │            │                │ ─→ (send to ASR/VAD)
     │            │                │
     │            │ ← TTS audio ─  │  (transcode to µ-law)
     │ ← hear ──  │                │
     │            │                │
```

**Differences from web:**
- Audio format: µ-law 8kHz (Twilio) → PCM16 16kHz (Deepgram/Cartesia)
- Latency budget: Add +50ms for PSTN encoding/decoding
- Barge-in: Twilio's `<Stream>` supports bidirectional, same logic applies

---

## 4. Component Design

### 4.1 Edge WebSocket Handler

**File:** `src/app/api/voice/stream/route.ts` (Vercel Edge Function)

```typescript
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const upgrade = req.headers.get('upgrade');
  if (upgrade !== 'websocket') {
    return new Response('Expected WebSocket', { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener('open', () => {
    const state = initializeConversationState(req);
    handleVoiceStream(socket, state);
  });

  return response;
}

async function handleVoiceStream(
  socket: WebSocket,
  state: ConversationState
) {
  // 1. Connect to ASR (Deepgram)
  const asrWs = await connectToDeepgram(state.conversation_id);

  // 2. Initialize VAD
  const vad = await loadSileroVAD();

  // 3. Set up message routing
  socket.onmessage = async (event) => {
    const { type, data } = JSON.parse(event.data);

    switch (type) {
      case 'audio':
        // User audio → VAD → ASR
        const vadResult = await vad.process(data);
        if (vadResult.speaking && !state.user_speaking) {
          handleBargeIn(state); // Cancel TTS
        }
        asrWs.send(data);
        break;

      case 'start':
        // Client ready, send greeting
        await sendGreeting(socket, state);
        break;
    }
  };

  // 4. Handle ASR results
  asrWs.onmessage = async (event) => {
    const { is_final, transcript } = JSON.parse(event.data);
    if (is_final) {
      await handleUserUtterance(socket, state, transcript);
    }
  };
}
```

### 4.2 VAD + Barge-in Manager

**File:** `src/lib/voice/vad.ts`

```typescript
import * as ort from 'onnxruntime-node'; // Or onnxruntime-web for client-side

export class SileroVAD {
  private session: ort.InferenceSession;
  private threshold = 0.5;

  async load() {
    this.session = await ort.InferenceSession.create(
      './models/silero_vad.onnx'
    );
  }

  async process(audioChunk: Buffer): Promise<{
    speaking: boolean;
    confidence: number;
  }> {
    // Convert audio to float32 tensor
    const tensor = new ort.Tensor(
      'float32',
      new Float32Array(audioChunk),
      [1, audioChunk.length]
    );

    const output = await this.session.run({ input: tensor });
    const confidence = output.output.data[0] as number;

    return {
      speaking: confidence > this.threshold,
      confidence,
    };
  }
}

export function handleBargeIn(state: ConversationState) {
  // 1. Cancel active TTS
  if (state.tts_connection && state.assistant_speaking) {
    state.tts_connection.send(JSON.stringify({ type: 'cancel' }));
  }

  // 2. Flush audio queue
  state.audio_queue.forEach(chunk => {
    chunk.flushed = true;
  });
  state.audio_queue = [];

  // 3. Update state
  state.user_speaking = true;
  state.assistant_speaking = false;
  state.last_vad_detection_at = new Date();
}
```

### 4.3 Intent + Tone Classifier

**File:** `src/lib/voice/intent-classifier.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function classifyIntent(
  transcript: string,
  conversationHistory: ConversationMessage[]
): Promise<{ intent: Intent; tone: Tone }> {
  const prompt = `Analyze this hotel guest utterance:

User said: "${transcript}"

Recent context:
${conversationHistory.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')}

Extract:
1. Intent (booking, inquiry, complaint, etc.)
2. Entities (dates, room types, counts)
3. Emotion (happy, frustrated, urgent, neutral)
4. Urgency (0-1 scale)

Respond in JSON:
{
  "intent": "book_room",
  "entities": { "check_in": "2025-01-15", "guests": 2 },
  "emotion": "neutral",
  "urgency": 0.3
}`;

  const start = Date.now();
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4.0',
    max_tokens: 200,
    messages: [{ role: 'user', content: prompt }],
  });

  const latency = Date.now() - start;
  const result = JSON.parse(response.content[0].text);

  return {
    intent: {
      type: result.intent,
      confidence: 0.9, // Haiku doesn't return confidence, estimate
      entities: result.entities,
      latency_ms: latency,
    },
    tone: {
      emotion: result.emotion,
      urgency_score: result.urgency,
      sentiment: deriveSentiment(result.emotion),
      latency_ms: latency,
    },
  };
}
```

### 4.4 Dialogue Manager

**File:** `src/lib/voice/dialogue-manager.ts`

```typescript
export async function generateResponse(
  state: ConversationState,
  userUtterance: string,
  intent: Intent,
  tone: Tone
): Promise<LLMDecision> {
  const systemPrompt = buildSystemPrompt(state.hotel_data, tone);
  const userMessage = buildUserMessage(userUtterance, intent);

  const start = Date.now();
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4.5',
    max_tokens: 300,
    system: systemPrompt,
    messages: state.history.concat([
      { role: 'user', content: userMessage }
    ]),
  });

  let firstTokenLatency: number | null = null;
  let fullResponse = '';

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta') {
      if (!firstTokenLatency) {
        firstTokenLatency = Date.now() - start;
        // Start TTS immediately with first chunk
        startTTSStream(chunk.delta.text, tone);
      }
      fullResponse += chunk.delta.text;
    }
  }

  return {
    response: fullResponse,
    latency_ms: firstTokenLatency!,
    total_tokens: stream.usage.total_tokens,
  };
}

function buildSystemPrompt(
  hotelData: any,
  tone: Tone
): string {
  const toneAdjustment = tone.emotion === 'frustrated'
    ? 'The guest sounds frustrated. Be extra empathetic and solution-focused.'
    : tone.urgency_score > 0.7
    ? 'This is urgent. Respond quickly and offer immediate help.'
    : 'Maintain a warm, helpful tone.';

  return `You are a voice assistant for ${hotelData.name}.

${toneAdjustment}

Hotel info:
- Amenities: ${hotelData.amenities.join(', ')}
- Check-in: ${hotelData.policies.check_in_time}
- Check-out: ${hotelData.policies.check_out_time}

Guidelines:
- Keep responses under 3 sentences (you're speaking, not writing)
- Use contractions ("I'll" not "I will")
- Ask clarifying questions if needed
- If you can't help, offer to transfer to a human`;
}
```

### 4.5 TTS Planner

**File:** `src/lib/voice/tts-planner.ts`

```typescript
import { Cartesia } from '@cartesia/cartesia-js';

const cartesia = new Cartesia({ apiKey: process.env.CARTESIA_API_KEY });

export async function streamTTS(
  text: string,
  tone: Tone,
  socket: WebSocket
): Promise<TTSPlan> {
  const prosody = calculateProsody(tone);

  const ttsStream = await cartesia.tts.stream({
    model: 'sonic',
    voice_id: 'conversational-female-1',
    transcript: text,
    output_format: {
      container: 'raw',
      encoding: 'pcm_f32le',
      sample_rate: 24000,
    },
    // Prosody controls
    speed: prosody.speed,
    emotion: mapEmotionToCartesia(tone.emotion),
  });

  let firstChunkLatency: number | null = null;
  const start = Date.now();

  for await (const chunk of ttsStream) {
    if (!firstChunkLatency) {
      firstChunkLatency = Date.now() - start;
    }

    // Send audio to client
    socket.send(JSON.stringify({
      type: 'audio',
      data: chunk.audio, // base64 or binary
    }));
  }

  return {
    text,
    voice_id: 'conversational-female-1',
    prosody_hints: prosody,
    latency_ms: firstChunkLatency!,
  };
}

function calculateProsody(tone: Tone): ProsodyHints {
  // Adjust speed based on urgency
  const speed = tone.urgency_score > 0.7 ? 1.1 : 1.0;

  // Match or contrast emotion
  const emotion = tone.emotion === 'frustrated'
    ? ToneEmotion.CALM // Don't mirror frustration
    : tone.emotion;

  return { speed, emotion };
}
```

---

## 5. Migration Path: Deleting Vapi Incrementally

### Phase 1: Parallel Implementation (Weeks 1-2)
**Goal:** Build new stack alongside Vapi, A/B test

```
src/
├── lib/
│   └── voice/
│       ├── vad.ts                    ← NEW
│       ├── asr-client.ts             ← NEW (Deepgram)
│       ├── intent-classifier.ts      ← NEW
│       ├── dialogue-manager.ts       ← NEW
│       ├── tts-planner.ts            ← NEW
│       └── state-manager.ts          ← NEW
├── app/api/voice/
│   ├── stream/route.ts               ← NEW (Edge WebSocket)
│   └── vapi-legacy/route.ts          ← Keep Vapi for comparison
└── app/(app)/demo-mode/
    ├── page.tsx                      ← Add toggle for "Custom" vs "Vapi"
    └── components/
        ├── VapiClient.tsx            ← Extract current Vapi code
        └── CustomVoiceClient.tsx     ← NEW implementation
```

**Tasks:**
- [ ] Set up Deepgram + Cartesia accounts
- [ ] Deploy Edge WebSocket to Vercel
- [ ] Create Supabase tables (conversations, utterances, intents, etc.)
- [ ] Build VAD module (Silero ONNX)
- [ ] Test latency: measure custom stack vs. Vapi side-by-side

**Success criteria:**
- Custom stack latency < 400ms (vs. Vapi's 500-800ms)
- Barge-in works smoothly (no audio glitches)

---

### Phase 2: Feature Parity (Weeks 3-4)
**Goal:** Match all Vapi features, add human-ness improvements

**Tasks:**
- [ ] Implement backchanneling ("Mm-hmm", "I see") during user pauses
- [ ] Add prosody tuning based on detected emotion
- [ ] Telephony support via Twilio Media Streams
- [ ] Error recovery (WebSocket reconnect, ASR fallback)
- [ ] Metrics dashboard (latency P50/P95/P99, intent accuracy)

**File changes:**
```diff
// demo-mode/page.tsx
- import Vapi from "@vapi-ai/web";
+ import { CustomVoiceClient } from './components/CustomVoiceClient';

- const vapiRef = useRef<Vapi | null>(null);
+ const voiceClientRef = useRef<CustomVoiceClient | null>(null);
```

---

### Phase 3: Deprecate Vapi (Week 5)
**Goal:** Remove Vapi, clean up dependencies

**Tasks:**
- [ ] Switch default voice client to custom stack
- [ ] Remove `@vapi-ai/web` from package.json
- [ ] Delete `NEXT_PUBLIC_VAPI_*` env vars
- [ ] Remove Vapi-specific UI (warnings, config checks)
- [ ] Update docs

**Files to delete:**
```
src/app/(app)/demo-mode/components/VapiClient.tsx
src/app/api/voice/vapi-legacy/route.ts
```

**Final diff:**
```diff
// package.json
- "@vapi-ai/web": "^2.5.2",

// .env.local
- NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
- NEXT_PUBLIC_VAPI_ASSISTANT_ID=...
```

---

## 6. Performance Targets

### 6.1 Latency Benchmarks

| Metric | Target | Stretch Goal | Vapi Baseline |
|--------|--------|--------------|---------------|
| First-word latency | <300ms | <200ms | 500-800ms |
| ASR finalization | <100ms | <80ms | ~150ms |
| Intent + tone | <150ms | <100ms | N/A (not exposed) |
| LLM first token | <200ms | <120ms | ~300ms |
| TTS first chunk | <100ms | <60ms | ~200ms |
| Barge-in reaction | <50ms | <20ms | ~100ms |

### 6.2 Human-ness Features

**Natural prosody:**
- Variable pacing (1.0x for complex info, 1.1x for confirmations)
- Strategic pauses (200ms before important info)
- Emotion matching (calm voice for frustrated users)

**Backchanneling:**
```typescript
// Insert brief acknowledgments during user pauses
const backchannel = tone.emotion === 'frustrated'
  ? "I understand..."
  : "Mm-hmm, got it.";

if (userPauseDuration > 1000 && userPauseDuration < 2000) {
  await playBackchannel(backchannel, socket);
}
```

**Adaptive interruption:**
- Don't interrupt mid-sentence (wait for phrase boundary)
- If user barges in, acknowledge: "Oh, sorry! Go ahead."

---

## Next Steps

1. **Review this design doc**
   - Validate architecture choices
   - Identify missing components
   - Adjust latency targets

2. **Spike: WebSocket + VAD**
   - Build minimal Edge WebSocket handler
   - Test Silero VAD latency on real audio
   - Measure round-trip time (client → server → client)

3. **Database schema**
   - Create Supabase migrations for all tables
   - Set up indexes for fast conversation lookups

4. **Prototype first flow**
   - Single-turn: User question → ASR → Intent → LLM → TTS
   - Measure end-to-end latency
   - Compare to Vapi

**Ready to start implementation? Let me know which phase to begin with!**
