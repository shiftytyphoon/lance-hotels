# Migration Roadmap: Vapi → Custom Voice Stack

**Objective:** Replace Vapi with a custom edge-first streaming voice architecture that achieves <300ms latency and natural human-like prosody.

**Timeline:** 5 weeks (incremental, production-safe rollout)

---

## Week 1: Foundation & Spike

### Goals
- Validate core assumptions (latency, Edge Function WebSocket support)
- Set up external service accounts
- Create database schema
- Build minimal viable pipeline (audio → ASR → response)

### Tasks

#### 1.1 Infrastructure Setup
- [ ] **Deepgram account**
  - Sign up at deepgram.com
  - Get API key, add to `.env.local` as `DEEPGRAM_API_KEY`
  - Test WebSocket streaming with sample audio
  - Document baseline latency (target: <100ms)

- [ ] **Cartesia account**
  - Sign up at cartesia.ai
  - Get API key, add to `.env.local` as `CARTESIA_API_KEY`
  - Test voice synthesis with prosody controls
  - Document baseline latency (target: <100ms)

- [ ] **Anthropic API**
  - Already have Claude access, verify streaming works
  - Test Claude Haiku latency for 200-token responses (target: <150ms)

- [ ] **Supabase setup**
  - Run `docs/voice-database-schema.sql` in Supabase SQL Editor
  - Verify all tables created successfully
  - Create indexes for performance
  - Set up RLS policies (basic version, refine later)

#### 1.2 Spike: Edge WebSocket
**Goal:** Prove Edge Functions can handle real-time audio streaming

```bash
# Create new API route
touch src/app/api/voice/spike/route.ts
```

**Minimal implementation:**
```typescript
// src/app/api/voice/spike/route.ts
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const upgrade = req.headers.get('upgrade');
  if (upgrade !== 'websocket') {
    return new Response('WebSocket required', { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onopen = () => {
    console.log('[Spike] WebSocket connected');
    socket.send(JSON.stringify({ type: 'connected' }));
  };

  socket.onmessage = (event) => {
    // Echo back (latency test)
    const received = Date.now();
    const data = JSON.parse(event.data);
    socket.send(JSON.stringify({
      type: 'echo',
      original: data,
      latency: Date.now() - data.timestamp,
      serverTime: received,
    }));
  };

  return response;
}
```

**Test client:**
```typescript
// src/app/(app)/demo-mode/components/SpikeTest.tsx
'use client';
import { useState } from 'react';

export function SpikeTest() {
  const [latency, setLatency] = useState<number | null>(null);

  const testWebSocket = () => {
    const ws = new WebSocket('ws://localhost:3000/api/voice/spike');

    ws.onopen = () => {
      const start = Date.now();
      ws.send(JSON.stringify({ type: 'ping', timestamp: start }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'echo') {
        setLatency(Date.now() - data.original.timestamp);
      }
    };
  };

  return (
    <div>
      <button onClick={testWebSocket}>Test WebSocket Latency</button>
      {latency && <p>Round-trip: {latency}ms</p>}
    </div>
  );
}
```

**Success criteria:**
- [ ] WebSocket connects successfully on Vercel Edge
- [ ] Round-trip latency < 50ms (local), < 100ms (deployed)
- [ ] No disconnects under sustained load (send 10 msgs/sec for 1 min)

#### 1.3 VAD Integration (Silero)
- [ ] Download Silero VAD ONNX model
  ```bash
  mkdir -p public/models
  curl -L https://github.com/snakers4/silero-vad/raw/master/files/silero_vad.onnx \
    -o public/models/silero_vad.onnx
  ```

- [ ] Install ONNX Runtime
  ```bash
  npm install onnxruntime-node
  ```

- [ ] Create VAD module (`src/lib/voice/vad.ts`)
  - Load model in Edge Function (or use client-side VAD as fallback)
  - Process audio chunks (16kHz PCM)
  - Return { speaking: boolean, confidence: number }
  - Target latency: <10ms per chunk

- [ ] Test VAD accuracy
  - Record 10 test audio samples (5 speech, 5 silence)
  - Measure precision/recall
  - Tune threshold (default 0.5, adjust based on false positive rate)

**Deliverables:**
- WebSocket latency benchmarks (documented in `docs/benchmarks.md`)
- VAD working end-to-end (client → Edge Function → VAD → response)
- Database schema deployed to Supabase

---

## Week 2: ASR + Intent Pipeline

### Goals
- Streaming speech-to-text with Deepgram
- Intent + tone classification with Claude Haiku
- Persist data to Supabase

### Tasks

#### 2.1 ASR Integration (Deepgram)
- [ ] Create Deepgram client (`src/lib/voice/asr-client.ts`)
  ```typescript
  import { createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

  export async function connectToDeepgram(conversationId: string) {
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
    const connection = deepgram.listen.live({
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      interim_results: true,
      endpointing: 300, // ms of silence before finalizing
    });

    connection.on(LiveTranscriptionEvents.Transcript, (data) => {
      if (data.is_final) {
        handleFinalTranscript(conversationId, data);
      }
    });

    return connection;
  }
  ```

- [ ] Wire ASR to WebSocket handler
  - User audio → VAD (detect speech start/end) → Deepgram
  - Deepgram transcript → Save to `utterances` table
  - Return transcript to client (update UI)

- [ ] Test ASR accuracy
  - Use Deepgram dashboard to compare transcripts
  - Target: >95% word accuracy on hotel domain phrases

#### 2.2 Intent + Tone Classifier
- [ ] Implement Claude Haiku classifier (`src/lib/voice/intent-classifier.ts`)
  - Takes: transcript, conversation history (last 3 turns)
  - Returns: { intent, entities, emotion, urgency }
  - Use structured output (JSON mode)
  - Target latency: <150ms

- [ ] Create prompt templates
  ```typescript
  const INTENT_PROMPT = `You are analyzing a hotel guest's speech.

  User said: "{transcript}"

  Recent conversation:
  {history}

  Extract:
  1. Intent (booking, inquiry, complaint, transfer, etc.)
  2. Entities (dates, guest count, room type, amenity names)
  3. Emotion (neutral, happy, frustrated, urgent, confused, angry)
  4. Urgency (0.0 = casual, 1.0 = emergency)

  Respond ONLY with JSON:
  {
    "intent": "book_room",
    "entities": {"check_in": "2025-01-15", "guests": 2},
    "emotion": "neutral",
    "urgency": 0.2
  }`;
  ```

- [ ] Save results to database
  - Insert into `intents` table
  - Insert into `tone_analyses` table
  - Link to `utterance_id`

#### 2.3 End-to-End Test (No TTS Yet)
- [ ] Build test UI in demo mode
  - User speaks → see transcript in real-time
  - Show detected intent + tone below transcript
  - Display latency breakdown (ASR: Xms, Intent: Xms)

**Deliverables:**
- ASR streaming with <100ms latency (measured)
- Intent/tone classification with >80% accuracy (manual spot-check)
- Data flowing into Supabase tables

---

## Week 3: Dialogue + TTS

### Goals
- Generate natural responses with Claude Sonnet
- Stream TTS audio with Cartesia
- Implement barge-in (user interrupts assistant)

### Tasks

#### 3.1 Dialogue Manager
- [ ] Create dialogue manager (`src/lib/voice/dialogue-manager.ts`)
  - Takes: user transcript, intent, tone, hotel context, conversation history
  - Calls Claude Sonnet 4.5 with streaming
  - Returns: LLM response (text) + first-token latency

- [ ] Build system prompt with hotel context
  ```typescript
  function buildSystemPrompt(hotel: Hotel, tone: Tone): string {
    const toneAdjustment = getToneAdjustment(tone);

    return `You are a voice assistant for ${hotel.name} in ${hotel.location}.

  ${toneAdjustment}

  Hotel Information:
  - Amenities: ${hotel.amenities.join(', ')}
  - Check-in: ${hotel.check_in_time}, Check-out: ${hotel.check_out_time}
  - Policies: ${JSON.stringify(hotel.policies)}

  Guidelines:
  - Speak naturally (contractions, 1-3 sentences max)
  - If guest is frustrated, be extra empathetic
  - If urgent, offer immediate help or transfer
  - If unclear, ask ONE clarifying question
  - Never mention that you're an AI unless asked

  Examples:
  User: "Do you have a pool?"
  You: "Yes! We have a rooftop pool open from 6am to 10pm."

  User: "I need a room for tonight!" (urgent)
  You: "I can help with that right away. How many guests?"`;
  }
  ```

- [ ] Implement streaming handler
  - Stream tokens from Claude
  - Send first token immediately to TTS (minimize latency)
  - Save full response to `llm_decisions` table

#### 3.2 TTS Integration (Cartesia)
- [ ] Create TTS planner (`src/lib/voice/tts-planner.ts`)
  - Takes: text, tone, prosody hints
  - Streams audio chunks from Cartesia
  - Returns: audio data + latency metrics

- [ ] Prosody calculation based on tone
  ```typescript
  function calculateProsody(tone: Tone): ProsodyHints {
    const baseSpeed = 1.0;

    // Adjust speed based on urgency
    const speed = tone.urgency_score > 0.7 ? 1.15 : baseSpeed;

    // Match or contrast emotion
    const emotion = tone.emotion === 'frustrated'
      ? 'calm'  // Don't mirror frustration
      : tone.emotion === 'urgent'
      ? 'concerned'
      : 'friendly';

    return { speed, emotion };
  }
  ```

- [ ] Stream audio to client
  - Send audio chunks via WebSocket
  - Client plays using Web Audio API
  - Monitor playback buffer (prevent glitches)

#### 3.3 Barge-in Implementation
- [ ] Detect user speech start (VAD)
  - When VAD detects user speaking AND assistant is speaking:
    - Send `CANCEL_TTS` to Cartesia WebSocket
    - Flush client audio queue
    - Mark last assistant utterance as `interrupted: true`

- [ ] Test barge-in smoothness
  - User interrupts mid-sentence → audio stops immediately
  - No audio glitches or echoes
  - Conversation continues naturally

**Deliverables:**
- Full pipeline working: User speaks → ASR → Intent/Tone → LLM → TTS → User hears
- Barge-in working smoothly (<50ms reaction time)
- Measured end-to-end latency: <400ms (target)

---

## Week 4: Telephony + Polish

### Goals
- Add Twilio integration for phone calls
- Improve human-ness (backchanneling, prosody)
- Performance optimization

### Tasks

#### 4.1 Twilio Media Streams
- [ ] Set up Twilio account
  - Buy phone number
  - Configure webhook: `https://your-domain.com/api/voice/twilio`

- [ ] Create Twilio handler (`src/app/api/voice/twilio/route.ts`)
  ```typescript
  export async function POST(req: NextRequest) {
    // Return TwiML with <Stream> element
    return new Response(`
      <?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Connecting you to ${hotelName}...</Say>
        <Stream url="wss://your-domain.com/api/voice/stream">
          <Parameter name="hotelId" value="${hotelId}" />
        </Stream>
      </Response>
    `, {
      headers: { 'Content-Type': 'text/xml' },
    });
  }
  ```

- [ ] Handle µ-law audio transcoding
  - Twilio sends 8kHz µ-law → convert to 16kHz PCM for Deepgram
  - Cartesia PCM → convert to 8kHz µ-law for Twilio

- [ ] Test phone call end-to-end
  - Call Twilio number
  - Speak → hear response
  - Measure latency (add +50ms budget for PSTN)

#### 4.2 Human-ness Improvements
- [ ] Backchanneling
  ```typescript
  // During user pauses, inject brief acknowledgments
  async function maybeBackchannel(pauseDuration: number, tone: Tone) {
    if (pauseDuration > 1000 && pauseDuration < 2000) {
      const backchannel = tone.emotion === 'frustrated'
        ? "I understand..."
        : "Mm-hmm.";

      await playShortAudio(backchannel);
    }
  }
  ```

- [ ] Strategic pauses in TTS
  ```typescript
  // Add pauses before important info
  const textWithPauses = addPausesBeforeNumbers(response);
  // "Your reservation is confirmed for... January 15th"
  ```

- [ ] Variable pacing
  - Confirmations → 1.1x speed ("Got it!")
  - Complex info → 0.95x speed (dates, prices)

#### 4.3 Performance Optimization
- [ ] Prefetch common responses
  - Cache TTS for greetings, confirmations, FAQs
  - Store in `tts_plans.audio_url`

- [ ] Parallel processing
  - Run intent + tone classification in parallel (not sequential)
  - Start LLM generation before intent fully completes

- [ ] Speculative generation
  - For high-confidence intents, start generating response before ASR finalizes
  - Cancel if ASR result changes

**Deliverables:**
- Telephony working (call via phone, not just web)
- Human-ness features live (backchanneling, pauses)
- Latency optimized to <300ms (stretch: <250ms)

---

## Week 5: Vapi Deprecation + Monitoring

### Goals
- A/B test custom stack vs. Vapi
- Switch default to custom stack
- Remove Vapi dependency
- Add observability

### Tasks

#### 5.1 A/B Testing
- [ ] Add feature flag in demo mode
  ```typescript
  const [voiceProvider, setVoiceProvider] = useState<'custom' | 'vapi'>('custom');
  ```

- [ ] Collect metrics
  - Custom stack: Save all data to Supabase (already done)
  - Vapi: Log latencies, transcript quality for comparison

- [ ] Compare side-by-side
  - Latency: Custom vs. Vapi
  - Transcription accuracy
  - Response quality (manual review)

#### 5.2 Remove Vapi
- [ ] Delete Vapi-specific code
  ```bash
  rm src/app/(app)/demo-mode/components/VapiClient.tsx
  rm src/app/api/voice/vapi-legacy/route.ts
  ```

- [ ] Update demo-mode/page.tsx
  ```diff
  - import Vapi from "@vapi-ai/web";
  - const vapiRef = useRef<Vapi | null>(null);
  + import { CustomVoiceClient } from './components/CustomVoiceClient';
  + const voiceClientRef = useRef<CustomVoiceClient | null>(null);
  ```

- [ ] Remove from package.json
  ```bash
  npm uninstall @vapi-ai/web
  ```

- [ ] Delete env vars
  ```diff
  - NEXT_PUBLIC_VAPI_PUBLIC_KEY=...
  - NEXT_PUBLIC_VAPI_ASSISTANT_ID=...
  ```

#### 5.3 Observability
- [ ] Add logging
  - Use Vercel's edge logs or integrate Axiom/Datadog
  - Log all errors to `error_logs` table

- [ ] Create dashboard
  - Build analytics page in app: `/app/(app)/analytics/page.tsx`
  - Show:
    - Latency P50/P95/P99 (use `performance_metrics` table)
    - Intent distribution (use `intent_distribution` view)
    - Emotion trends (use `emotion_distribution` view)
    - Error rate by component

- [ ] Set up alerts
  - Latency > 500ms → Slack/email notification
  - Error rate > 5% → Alert
  - Twilio call failures → Alert

**Deliverables:**
- Vapi fully removed from codebase
- Custom stack is default (and only) voice provider
- Monitoring dashboard live

---

## Success Metrics

After Week 5, measure:

| Metric | Baseline (Vapi) | Target (Custom) | Actual |
|--------|-----------------|-----------------|--------|
| First-word latency (P50) | 600ms | <300ms | ___ |
| First-word latency (P95) | 900ms | <400ms | ___ |
| Transcription accuracy | ~95% | >95% | ___ |
| Barge-in latency | ~100ms | <50ms | ___ |
| Cost per minute | $0.20 | <$0.08 | ___ |
| Human-ness score (1-10) | 6 | 8+ | ___ |

---

## Risk Mitigation

### Risk: Edge Functions can't handle WebSocket load
**Mitigation:**
- Fall back to Vercel Serverless Functions (Node.js runtime)
- Or deploy to Cloudflare Durable Objects

### Risk: Latency targets not met
**Mitigation:**
- Use regional deployments (AWS Lambda@Edge)
- Implement speculative generation
- Cache common responses

### Risk: ASR/TTS provider downtime
**Mitigation:**
- Add fallback providers (Deepgram → AssemblyAI, Cartesia → ElevenLabs)
- Graceful degradation (text-only mode if TTS fails)

### Risk: Database writes slow down real-time flow
**Mitigation:**
- Use async inserts (don't block WebSocket)
- Batch writes every 500ms
- Add Redis cache for conversation state

---

## Next Steps

1. **Review this roadmap** with your team
2. **Adjust timeline** based on resources (can parallelize with multiple devs)
3. **Approve architecture** from `voice-architecture.md`
4. **Start Week 1 tasks** (I can help implement any component)

**Ready to begin? Let me know which week/task to start with!**
