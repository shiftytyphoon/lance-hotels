# Voice Stack Documentation

This directory contains the complete design and migration plan for Lance Hotels' custom voice infrastructure.

## 📄 Documents

### 1. [voice-analysis.md](./voice-analysis.md)
**Current state audit & architecture comparison**

- Vapi integration audit (where it's used, what it provides)
- Missing pieces for a custom stack (ASR, VAD, intent, TTS, orchestration)
- 3 architecture options with latency/cost/complexity tradeoffs:
  - **Option A: Edge-First Streaming** (recommended)
  - Option B: Regional Orchestrator
  - Option C: Hybrid Progressive
- Why Option A beats Vapi (200-400ms vs 500-800ms latency)

**Start here** if you want the big-picture context.

---

### 2. [voice-architecture.md](./voice-architecture.md)
**Detailed design for the recommended architecture**

- System diagrams (client → edge → ASR/TTS/LLM)
- Data models (TypeScript interfaces for Utterance, Intent, Tone, LLMDecision, TTSPlan, etc.)
- Sequence diagrams:
  - Happy path (user question → assistant response)
  - Barge-in (user interrupts assistant mid-sentence)
  - Telephony (Twilio phone call flow)
- Component design (pseudocode for VAD, intent classifier, dialogue manager, TTS planner)
- Migration path: which modules to build first to delete Vapi cleanly
- Performance targets (latency breakdown, human-ness features)

**Use this** for implementation guidance.

---

### 3. [voice-database-schema.sql](./voice-database-schema.sql)
**Complete Supabase/PostgreSQL schema**

Tables:
- `conversations` - Call metadata (hotel, channel, duration, stats)
- `utterances` - Individual speech turns (user/assistant)
- `intents` - Extracted intents + entities
- `tone_analyses` - Emotion, sentiment, urgency detection
- `llm_decisions` - Dialogue generation (prompts, responses, latency)
- `tts_plans` - TTS synthesis metadata (prosody hints, audio URLs)
- `performance_metrics` - Aggregated latency/quality metrics
- `error_logs` - Debugging and monitoring

Plus:
- Views for analytics (hotel performance, intent distribution, emotion trends)
- Helper functions (calculate latency, get transcript)
- Row-level security policies

**Run this** in Supabase SQL Editor to create all tables.

---

### 4. [migration-roadmap.md](./migration-roadmap.md)
**5-week step-by-step migration plan**

Week-by-week breakdown:
- **Week 1:** Foundation (Deepgram, Cartesia setup, Edge WebSocket spike, VAD integration)
- **Week 2:** ASR + Intent pipeline (streaming transcription, Claude Haiku classification)
- **Week 3:** Dialogue + TTS (Claude Sonnet responses, Cartesia streaming, barge-in)
- **Week 4:** Telephony + Polish (Twilio integration, backchanneling, latency optimization)
- **Week 5:** Vapi deprecation (A/B testing, remove Vapi, add monitoring)

Includes:
- Concrete tasks with checkboxes
- Code snippets for each component
- Success criteria for each week
- Risk mitigation strategies

**Follow this** to execute the migration.

---

## 🎯 Quick Start

1. **Read the analysis** → [voice-analysis.md](./voice-analysis.md)
2. **Review the architecture** → [voice-architecture.md](./voice-architecture.md)
3. **Set up the database** → Run [voice-database-schema.sql](./voice-database-schema.sql) in Supabase
4. **Start building** → Follow [migration-roadmap.md](./migration-roadmap.md) Week 1 tasks

## 🔑 Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| **Architecture** | Edge-First Streaming | Best latency (<300ms), cost-efficient, scales to zero |
| **ASR** | Deepgram Nova 2 | 90ms latency, excellent accuracy, WebSocket streaming |
| **TTS** | Cartesia Sonic | 60-100ms latency, prosody controls, WebSocket streaming |
| **Intent/Tone** | Claude Haiku | 50-150ms, high accuracy, streaming |
| **Dialogue** | Claude Sonnet 4.5 | Best reasoning, streaming, function calling |
| **VAD** | Silero (ONNX) | <10ms, runs in-process, no API calls |
| **Orchestration** | Vercel Edge Functions | WebSocket support, global edge network, zero cold starts |
| **Database** | Supabase (PostgreSQL) | Real-time, RLS, great DX, PostgREST API |

## 📊 Expected Outcomes

### Latency (vs. Vapi baseline)
```
Vapi:   500-800ms first-word latency
Custom: 200-400ms first-word latency (2-4x faster)
```

### Cost (per minute of conversation)
```
Vapi:   $0.15-0.30/min
Custom: $0.05-0.08/min (50-70% cheaper)
```

### Human-ness improvements
- ✅ Barge-in reaction: 100ms → <50ms
- ✅ Prosody control (speed, emotion, pauses)
- ✅ Backchanneling ("Mm-hmm", "I see")
- ✅ Tone-aware responses (empathetic for frustrated users)
- ✅ Variable pacing (faster confirmations, slower complex info)

## 🚀 What's Next?

After reviewing these docs:

1. **Approve the architecture** (or suggest changes)
2. **Set up external accounts** (Deepgram, Cartesia, Twilio)
3. **Deploy database schema** to Supabase
4. **Start Week 1 implementation** (WebSocket spike + VAD)

## 📞 Implementation Support

I'm ready to help implement any component:
- Edge WebSocket handler
- VAD integration (Silero ONNX)
- ASR client (Deepgram streaming)
- Intent/tone classifier (Claude Haiku)
- Dialogue manager (Claude Sonnet)
- TTS planner (Cartesia)
- Barge-in logic
- Telephony integration (Twilio)
- Analytics dashboard

Just let me know which piece to build first!

---

**Last Updated:** 2025-12-25
**Status:** Design Complete, Ready for Implementation
