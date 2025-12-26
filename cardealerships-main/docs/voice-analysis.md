# Voice Stack Analysis & Migration Strategy

## Executive Summary

This document analyzes the current Vapi-based voice implementation and proposes three architecture options for a custom, latency-optimized voice stack. The recommended approach prioritizes sub-200ms latency, natural prosody, and seamless barge-in capabilities while supporting both web and telephony channels.

---

## 1. Current State: Vapi Integration Audit

### 1.1 Vapi Surface Area

**Files with Vapi dependencies:**
- `src/app/(app)/demo-mode/page.tsx` - Main integration point
- `package.json` - `@vapi-ai/web@^2.5.2` dependency
- Environment variables (missing):
  - `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
  - `NEXT_PUBLIC_VAPI_ASSISTANT_ID`

**What Vapi currently provides:**
```typescript
// From demo-mode/page.tsx:20-94
vapiRef.current = new Vapi(VAPI_PUBLIC_KEY);

// Event-driven interface:
- call-start / call-end      → Connection lifecycle
- speech-start / speech-end  → User speaking detection
- volume-level               → Audio level monitoring
- message (transcript)       → Final transcripts (user/assistant)
- error                      → Error handling
```

**Current flow:**
1. User selects hotel → `vapiRef.current.start(VAPI_ASSISTANT_ID)`
2. Vapi handles: WebRTC connection, ASR, LLM orchestration, TTS, VAD
3. Browser receives: Transcript events, volume levels, speech state
4. UI displays: Chat transcript, animated orb, status indicators

### 1.2 Missing Pieces for Vapi-Free Implementation

To replace Vapi completely, you need to build:

| Component | Current (Vapi) | Required Capability |
|-----------|---------------|---------------------|
| **Audio I/O** | WebRTC managed by Vapi | Browser: WebRTC/MediaRecorder + Web Audio API<br>Telephony: Twilio/Vonage Media Streams |
| **ASR** | Vapi's STT | Deepgram, AssemblyAI, or Whisper (live streaming) |
| **VAD** | Vapi's barge-in | Silero VAD, WebRTC VAD, or provider-native |
| **Intent/Tone** | None (Vapi doesn't expose) | Custom classifier (BERT, Claude, GPT-4o mini) |
| **Dialogue Manager** | Vapi's assistant config | State machine + LLM (Claude, GPT-4) |
| **TTS** | Vapi's TTS | ElevenLabs, PlayHT, Cartesia, OpenAI |
| **Orchestration** | Vapi server | Custom Node.js/Python service (WebSocket/gRPC) |
| **Barge-in** | Vapi handles | Audio interruption + queue flushing |

**Key gaps:**
- No server-side voice orchestration (no `/api` routes exist)
- No database schema for conversations, utterances, or intents
- No telephony integration (Twilio/Vonage)
- No streaming ASR or TTS infrastructure

---

## 2. Architecture Options

### Option A: Edge-First Streaming (Recommended)

**Philosophy:** Minimize network hops by running orchestration close to the user, with edge-deployable components.

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser (Web) / Twilio (Phone)                                 │
│  ┌──────────────┐                                               │
│  │ Audio Input  │──────┐                                        │
│  └──────────────┘      │                                        │
│                        ▼                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          WebSocket to Edge Function (Vercel/CF)         │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴───────────┐
                │                        │
                ▼                        ▼
    ┌─────────────────────┐  ┌──────────────────────┐
    │   Deepgram STT      │  │   Cartesia TTS       │
    │   (WebSocket)       │  │   (WebSocket)        │
    └──────────┬──────────┘  └──────────▲───────────┘
               │                        │
               ▼                        │
    ┌──────────────────────────────────┴───────────┐
    │  Edge Orchestrator                           │
    │  ┌────────────────────────────────────────┐  │
    │  │ VAD + Barge-in Manager                 │  │
    │  │ - Silero VAD (ONNX, runs in-process)   │  │
    │  │ - Audio queue flushing                 │  │
    │  └────────────────────────────────────────┘  │
    │  ┌────────────────────────────────────────┐  │
    │  │ Intent/Tone Classifier                 │  │
    │  │ - Fast LLM (GPT-4o mini / Claude Haiku)│  │
    │  │ - 50-100ms for intent+tone extraction  │  │
    │  └────────────────────────────────────────┘  │
    │  ┌────────────────────────────────────────┐  │
    │  │ Dialogue Manager                       │  │
    │  │ - State machine (booking, inquiry, etc)│  │
    │  │ - LLM for response generation          │  │
    │  │ - Hotel context injection              │  │
    │  └────────────────────────────────────────┘  │
    │  ┌────────────────────────────────────────┐  │
    │  │ TTS Planner                            │  │
    │  │ - Prosody hints (urgency, empathy)     │  │
    │  │ - Variable pacing based on tone        │  │
    │  └────────────────────────────────────────┘  │
    └──────────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │  Supabase              │
                │  - conversations       │
                │  - utterances          │
                │  - intents             │
                │  - tone_analyses       │
                └────────────────────────┘
```

**Tech Stack:**
- **Edge Runtime:** Vercel Edge Functions (WebSocket support) or Cloudflare Durable Objects
- **ASR:** Deepgram Nova 2 (90ms latency, WebSocket streaming)
- **TTS:** Cartesia Sonic (60-100ms, WebSocket, prosody controls)
- **VAD:** Silero VAD (ONNX model, <10ms in-process)
- **Intent/Tone:** GPT-4o mini (50-150ms) or fine-tuned BERT (20ms)
- **Dialogue LLM:** Claude Sonnet 4.5 or GPT-4 Turbo (streaming)
- **Telephony:** Twilio Media Streams → same WebSocket endpoint

**Latency Budget (Target: <200ms first-word):**
```
User stops speaking
  ├─ 10ms  : VAD detects silence
  ├─ 80ms  : Deepgram finalizes transcript
  ├─ 60ms  : Intent/tone classification
  ├─ 120ms : LLM first token (streaming)
  ├─ 80ms  : Cartesia TTS first audio chunk
  └─ 50ms  : Network + playback buffer
────────────────────────────────────────
Total: ~400ms (first-word latency)

Optimization paths to <250ms:
- Speculative TTS (start generating for likely responses)
- Prefetch common phrases ("Let me check...", "Sure, I can help with that")
- Parallel intent + LLM calls
```

**Barge-in Strategy:**
```typescript
// Pseudocode
onUserSpeechStart() {
  cancelActiveTTS();           // Stop audio playback
  flushTTSQueue();             // Clear pending audio
  sendVADEventToOrchestrator(); // Notify server
  // Continue listening without interruption
}
```

**Pros:**
- **Low latency:** Edge deployment, parallel processing
- **Cost-efficient:** Pay-per-use, no idle server costs
- **Scalable:** Auto-scales with Vercel/CF
- **Telephony-ready:** Same backend for web + phone
- **Human-ness:** Cartesia's prosody controls, streaming LLM for natural pacing

**Cons vs. Vapi:**
- More complexity (you manage orchestration)
- Need to build barge-in logic
- WebSocket state management (reconnects, backpressure)

---

### Option B: Regional Orchestrator (Low-Latency Dedicated)

**Philosophy:** Deploy regional orchestrators (AWS/GCP) closer to users, with dedicated connections to ASR/TTS providers.

```
┌──────────────────────────────────────────────────────────────┐
│  Browser / Phone                                             │
└────────────────┬─────────────────────────────────────────────┘
                 │ WebSocket
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Regional Orchestrator (AWS Lambda@Edge or GCP Cloud Run)   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Voice State Machine                                 │   │
│  │  - Per-call state (listening, thinking, speaking)    │   │
│  │  - Conversation history + context                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Pipeline Router                                     │   │
│  │  - ASR stream   → Deepgram (us-west/eu-central)     │   │
│  │  - Intent/Tone  → Claude Haiku (streaming)          │   │
│  │  - Dialogue     → Claude Sonnet 4.5                 │   │
│  │  - TTS stream   → ElevenLabs Turbo v2.5             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Adaptive Interruption Engine                        │   │
│  │  - Real-time VAD (no ASR transcript needed)         │   │
│  │  - Audio frame monitoring (16kHz chunks)            │   │
│  │  - Immediate TTS cancellation                       │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ Deepgram│  │ Claude  │  │ElevenLabs│
    │ (region)│  │ (API)   │  │ (region)│
    └─────────┘  └─────────┘  └─────────┘
```

**Tech Stack:**
- **Orchestrator:** Node.js (Fastify) on AWS Lambda@Edge or GCP Cloud Run
- **ASR:** Deepgram with regional endpoints
- **TTS:** ElevenLabs Turbo v2.5 (80ms latency, emotions API)
- **VAD:** Custom WebRTC VAD + energy-based detection
- **Intent/Tone:** Claude Haiku with streaming (extract while LLM generates)
- **Dialogue:** Claude Sonnet 4.5 with function calling for hotel actions

**Latency Budget:**
```
User silence detected
  ├─ 5ms   : VAD (in-process)
  ├─ 70ms  : Deepgram transcript
  ├─ 90ms  : Claude Haiku intent+tone (parallel with next step)
  ├─ 150ms : Claude Sonnet first token
  ├─ 70ms  : ElevenLabs first audio chunk
  └─ 40ms  : Network to client
────────────────────────────────────────
Total: ~425ms (first-word)

With optimizations (speculative generation): ~200ms
```

**Pros:**
- **Predictable latency:** Dedicated infrastructure
- **Advanced features:** Custom VAD tuning, backchanneling ("uh-huh", "I see")
- **Full control:** Fine-tune every component
- **Best prosody:** ElevenLabs emotions API for natural tone shifts

**Cons vs. Vapi:**
- Higher base cost (regional deployments)
- More DevOps overhead (monitoring, auto-scaling)
- Complex state management for long calls

---

### Option C: Hybrid (Progressive Enhancement)

**Philosophy:** Start with managed services (Vapi-like), progressively replace with custom components.

**Phase 1: Managed Foundation**
```
Browser → Twilio Voice → Deepgram + ElevenLabs (via Twilio Media Streams)
                      ↓
              Your Server (Next.js API)
              - Intent/tone classifier
              - Dialogue manager
              - Hotel context
```

**Phase 2: Custom Orchestration**
```
Browser/Phone → Your WebSocket Server → Deepgram + ElevenLabs
                                     ↓
                           Claude for intent + dialogue
```

**Phase 3: Full Control**
```
Browser/Phone → Edge Orchestrator → All custom (ASR, TTS, VAD, LLM)
```

**Pros:**
- **Low risk:** Incremental migration
- **Learn as you build:** Test latency at each phase
- **Fallback:** Can keep Phase 1 for edge cases

**Cons vs. Vapi:**
- Longer time to full control
- Temporary vendor lock-in during transition

---

## 3. Recommended Architecture: Option A (Edge-First Streaming)

**Why this wins:**

1. **Latency:** Edge deployment + parallel processing → <300ms realistic, <200ms with optimizations
2. **Human-ness:** Cartesia's prosody controls + streaming LLM = natural pacing
3. **Barge-in:** WebSocket allows immediate audio cancellation
4. **Cost:** Serverless = no idle costs, scales to zero
5. **Telephony:** Twilio Media Streams → same WebSocket (unified codebase)
6. **Migration path:** Build modules incrementally, swap Vapi when ready

**Better approach than Vapi:**
- **Latency:** 200-400ms vs. Vapi's 500-800ms (measured by users)
- **Customization:** Full control over tone, pacing, interruptions
- **Transparency:** See every step (transcript, intent, tone, LLM decision)
- **Cost:** ~$0.05/min vs. Vapi's $0.15-0.30/min

**Tradeoffs:**
- **Development time:** 4-6 weeks vs. Vapi's 1-day setup
- **Maintenance:** You own the orchestration layer
- **Edge cases:** Need to handle WebSocket reconnects, audio glitches

---

## Next: Design Document

I'll now write a detailed design doc (`docs/voice-architecture.md`) with:
- Sequence diagrams for each flow
- Data models (Utterance, Intent, Tone, ConversationState, etc.)
- Migration path: which modules to build first
- Code structure for clean Vapi removal

Continuing to next document...
