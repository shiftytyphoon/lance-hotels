# Voice Stack Setup Guide

This guide walks you through setting up all external services and environment variables for the custom voice stack.

## Quick Start: Stub Mode (No API Keys Required)

**You can run the entire voice stack in stub mode without creating any external accounts.**

1. Set stub mode in `.env.local`:
   ```bash
   VOICE_STACK_MODE=stub
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000/demo-mode

4. The system will use mocked responses for ASR, intent/tone, dialogue, and TTS.

**When ready for production**, set `VOICE_STACK_MODE=live` and configure the services below.

---

## Prerequisites

- Node.js 20+ installed
- npm or pnpm
- Supabase account (already configured)
- For **live mode**: Credit card for paid API services

---

## 1. Deepgram (ASR - Speech-to-Text)

### Why Deepgram?
- 90ms latency (Nova 2 model)
- WebSocket streaming for real-time transcription
- Excellent accuracy on hotel/hospitality domain
- Cost: $0.0043/minute

### Setup Steps

1. **Sign up** at [https://deepgram.com](https://deepgram.com)

2. **Create API key:**
   - Go to Console → API Keys
   - Click "Create a New API Key"
   - Name it: "Lance Hotels Voice Stack"
   - Copy the key (starts with `...`)

3. **Add to environment:**
   ```bash
   # .env.local
   DEEPGRAM_API_KEY=your_api_key_here
   ```

4. **Test the connection (optional):**
   ```bash
   curl -X POST "https://api.deepgram.com/v1/listen" \
     -H "Authorization: Token YOUR_API_KEY" \
     -H "Content-Type: audio/wav" \
     --data-binary @sample.wav
   ```

5. **Enable Nova 2 model:**
   - No special setup needed
   - Specify in API call: `model: 'nova-2'`

---

## 2. Cartesia (TTS - Text-to-Speech)

### Why Cartesia?
- 60-100ms latency (Sonic model)
- WebSocket streaming for real-time audio
- Prosody controls (speed, emotion, emphasis)
- Most human-sounding among low-latency options
- Cost: ~$0.015/minute

### Setup Steps

1. **Sign up** at [https://cartesia.ai](https://cartesia.ai)
   - Join waitlist if not yet public (as of Dec 2025, should be open)

2. **Create API key:**
   - Go to Dashboard → API Keys
   - Generate new key
   - Copy the key

3. **Add to environment:**
   ```bash
   # .env.local
   CARTESIA_API_KEY=your_api_key_here
   ```

4. **Choose default voice:**
   - Browse voice library: https://cartesia.ai/voices
   - Recommended for hotels: `conversational-female-1` or `professional-male-1`
   - Copy voice ID

   ```bash
   # .env.local
   CARTESIA_DEFAULT_VOICE_ID=voice_id_here
   ```

5. **Test (using their SDK):**
   ```javascript
   import { Cartesia } from '@cartesia/cartesia-js';
   const cartesia = new Cartesia({ apiKey: process.env.CARTESIA_API_KEY });
   // Test TTS...
   ```

---

## 3. OpenAI (Intent/Tone + Dialogue)

### Why OpenAI?
- **GPT-4o mini:** 50-100ms for intent/tone classification, very cheap ($0.15/M input tokens)
- **GPT-4o:** Excellent reasoning for dialogue, streaming, function calling, low latency
- Widely available, simple API

### Setup Steps

1. **Get API key:**
   - Go to https://platform.openai.com/api-keys
   - Create new secret key: "Lance Hotels Voice"
   - Copy the key (starts with `sk-...`)

2. **Add to environment:**
   ```bash
   # .env.local
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Verify API access:**
   ```bash
   curl https://api.openai.com/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $OPENAI_API_KEY" \
     -d '{
       "model": "gpt-4o-mini",
       "messages": [{"role": "user", "content": "Hello"}],
       "max_tokens": 50
     }'
   ```

4. **Rate limits:**
   - GPT-4o mini: 500 requests/min, 200K tokens/min (Tier 1)
   - GPT-4o: 500 requests/min, 30K tokens/min (Tier 1)
   - More than enough for voice workload

---

## 3a. Anthropic Claude (Optional Alternative)

**Claude is optional.** The voice stack defaults to OpenAI, but you can switch to Claude if preferred.

### Setup Steps

1. **Get API key:**
   - https://console.anthropic.com/settings/keys
   - Create new key: "Lance Hotels Voice"

2. **Add to environment:**
   ```bash
   # .env.local (optional)
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

3. **Switch to Claude:**
   ```bash
   # .env.local
   LLM_PROVIDER=anthropic  # Default is 'openai'
   ```

**Models used:**
- Intent/Tone: `claude-haiku-4.0` (~50-150ms, $0.25/M tokens)
- Dialogue: `claude-sonnet-4.5` (streaming, function calling)

---

## 4. Supabase (Database)

### Setup Steps

1. **Deploy schema:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy contents of `docs/voice-database-schema.sql`
   - Run the migration
   - Verify tables created:
     ```sql
     SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public';
     ```

2. **Environment variables (already have):**
   ```bash
   # .env.local (already set)
   NEXT_PUBLIC_SUPABASE_URL=https://iotrxrgtvoibxozftyld.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Optional: Service role key (for server-side):**
   - Go to Project Settings → API
   - Copy `service_role` key (keep secret!)
   - Add to `.env.local`:
     ```bash
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     ```

4. **Enable Row Level Security:**
   - Already configured in schema
   - Policies allow service role full access

---

## 5. Optional: Twilio (Telephony - Week 4)

### Setup Steps (can skip for now)

1. **Sign up** at [https://twilio.com](https://twilio.com)

2. **Buy phone number:**
   - Console → Phone Numbers → Buy a Number
   - Choose a local or toll-free number
   - Cost: ~$1-2/month + usage

3. **Get credentials:**
   ```bash
   # .env.local
   TWILIO_ACCOUNT_SID=ACxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. **Configure webhook (Week 4):**
   - Phone Number Settings → Voice Configuration
   - Webhook URL: `https://your-domain.com/api/voice/twilio`
   - HTTP POST

---

## 6. Complete Environment Variables

### Minimal Setup (Stub Mode - No API Keys Required)

```bash
# .env.local

# Core Configuration
VOICE_STACK_MODE=stub  # 'stub' = mocked responses, 'live' = real APIs

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://iotrxrgtvoibxozftyld.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Full Setup (Live Mode - Requires API Keys)

```bash
# .env.local

# ─────────────────────────────────────────────────────────────
# Core Configuration
# ─────────────────────────────────────────────────────────────
VOICE_STACK_MODE=live  # 'stub' or 'live'

# ─────────────────────────────────────────────────────────────
# Supabase (already configured)
# ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://iotrxrgtvoibxozftyld.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For server-side writes

# ─────────────────────────────────────────────────────────────
# ASR (Speech-to-Text)
# ─────────────────────────────────────────────────────────────
DEEPGRAM_API_KEY=your_deepgram_api_key

# ─────────────────────────────────────────────────────────────
# TTS (Text-to-Speech)
# ─────────────────────────────────────────────────────────────
CARTESIA_API_KEY=your_cartesia_api_key
CARTESIA_DEFAULT_VOICE_ID=your_preferred_voice_id  # e.g., "conversational-female-1"

# ─────────────────────────────────────────────────────────────
# LLM (Intent/Tone + Dialogue)
# ─────────────────────────────────────────────────────────────
LLM_PROVIDER=openai  # 'openai' (default) or 'anthropic'

# OpenAI (primary, required if LLM_PROVIDER=openai)
OPENAI_API_KEY=your_openai_api_key

# Anthropic Claude (optional, only if LLM_PROVIDER=anthropic)
# ANTHROPIC_API_KEY=your_anthropic_api_key

# ─────────────────────────────────────────────────────────────
# Telephony (Week 4, optional for now)
# ─────────────────────────────────────────────────────────────
# TWILIO_ACCOUNT_SID=ACxxxxx
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_PHONE_NUMBER=+1234567890

# ─────────────────────────────────────────────────────────────
# Feature Flags
# ─────────────────────────────────────────────────────────────
ENABLE_SUPABASE_LOGGING=false  # Set true when ready to persist data
ENABLE_PROSODY_TUNING=true     # Emotion-based TTS adjustments
ENABLE_BACKCHANNELING=false    # "Mm-hmm" responses (Week 3)
ENABLE_SPECULATIVE_TTS=false   # Pre-generate common phrases (Week 3)
```

### Mode Comparison

| Mode | Requires API Keys? | Use Case |
|------|-------------------|----------|
| `stub` | ❌ No | Development, testing UI, no external accounts |
| `live` | ✅ Yes | Production, real conversations |

**How stub mode works:**
- ASR returns fake transcripts ("Hello, I need a room for tonight")
- Intent classifier returns mocked intents (e.g., `book_room`)
- Dialogue returns pre-written responses
- TTS returns fake audio metadata (no actual synthesis)
- WebSocket still works, full UI functional

---

## 7. Testing Your Setup

### Test 1: WebSocket Latency

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000/demo-mode

3. You should see the **WebSocket Latency Test** component at the top

4. Click **Connect** → **Run Test**

5. **Expected results:**
   - Average: <30ms (local)
   - P95: <50ms (local)
   - If deployed to Vercel: <100ms is excellent

### Test 2: Deepgram Connection

Create a test script:

```typescript
// scripts/test-deepgram.ts
import { createClient } from '@deepgram/sdk';

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

const connection = deepgram.listen.live({
  model: 'nova-2',
  language: 'en-US',
});

connection.on('open', () => console.log('✅ Deepgram connected'));
connection.on('error', (err) => console.error('❌ Deepgram error:', err));

setTimeout(() => connection.finish(), 2000);
```

Run:
```bash
npx tsx scripts/test-deepgram.ts
```

### Test 3: Cartesia TTS

```typescript
// scripts/test-cartesia.ts
import { Cartesia } from '@cartesia/cartesia-js';

const cartesia = new Cartesia({ apiKey: process.env.CARTESIA_API_KEY });

async function test() {
  const stream = await cartesia.tts.stream({
    model: 'sonic',
    voice_id: process.env.CARTESIA_DEFAULT_VOICE_ID,
    transcript: 'Hello! This is a test.',
    output_format: { container: 'raw', encoding: 'pcm_f32le', sample_rate: 24000 },
  });

  console.log('✅ Cartesia streaming...');
  for await (const chunk of stream) {
    console.log('Audio chunk received');
    break; // Just test first chunk
  }
}

test();
```

### Test 4: Claude API

```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-haiku-4.0",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Say hello in one sentence"}]
  }'
```

Expected output:
```json
{
  "content": [{"text": "Hello!"}],
  "model": "claude-haiku-4.0",
  ...
}
```

---

## 8. Cost Estimation

Based on 1 hour of conversation (60 minutes):

| Service | Cost/min | 60 min | Notes |
|---------|----------|--------|-------|
| Deepgram (ASR) | $0.0043 | $0.26 | Nova 2, streaming |
| Cartesia (TTS) | $0.015 | $0.90 | Sonic, WebSocket |
| Claude Haiku (Intent) | ~$0.001 | $0.06 | ~1 call/turn, 200 tokens |
| Claude Sonnet (Dialogue) | ~$0.02 | $1.20 | ~1 call/turn, 300 tokens |
| **Total** | **~$0.04** | **~$2.42** | Per hour |

**Compared to Vapi:** $0.15-0.30/min → $9-18/hour

**Savings:** 60-87% cheaper

---

## 9. Troubleshooting

### Issue: "Deepgram API key invalid"
- Verify key starts with correct prefix
- Check Console → API Keys → ensure key is active
- Regenerate if needed

### Issue: "Cartesia voice ID not found"
- Browse https://cartesia.ai/voices
- Copy exact voice ID (case-sensitive)
- Some voices may be premium (check your plan)

### Issue: "WebSocket connection failed"
- Vercel Edge Functions WebSocket support: verify `runtime = 'edge'` in route.ts
- Local dev: Next.js doesn't support WebSocket in dev mode well—test on Vercel preview deploy
- Alternative: Use Cloudflare Workers for WebSocket if Vercel issues persist

### Issue: "Rate limit exceeded"
- Claude: Check your tier at console.anthropic.com
- Deepgram: Upgrade plan if >10,000 min/month
- Implement request queuing if needed

---

## 10. Next Steps

Once all services are configured:

1. ✅ Run WebSocket latency test (should see <50ms local)
2. ✅ Deploy database schema to Supabase
3. ✅ Test each API with provided scripts
4. 🚀 Proceed to **Week 1, Task 4**: Scaffold TypeScript interfaces

---

**Questions?** Let me know if any service signup is blocked or if you need help with API testing.
