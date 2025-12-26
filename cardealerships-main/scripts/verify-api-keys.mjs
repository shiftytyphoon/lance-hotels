#!/usr/bin/env node
/**
 * API Key Verification Script
 *
 * Tests all external API keys to ensure they work.
 *
 * Usage:
 *   Make sure .env.local is loaded, then:
 *   node --env-file=.env.local scripts/verify-api-keys.mjs
 */

console.log('🔍 Verifying API Keys...\n');

// ─────────────────────────────────────────────────────────────────────
// 1. OpenAI
// ─────────────────────────────────────────────────────────────────────

async function testOpenAI() {
  try {
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "API key works!" in 3 words' }],
      max_tokens: 10,
    });

    console.log('✅ OpenAI (GPT-4o mini):', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ OpenAI:', error.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// 2. Deepgram
// ─────────────────────────────────────────────────────────────────────

async function testDeepgram() {
  try {
    const { createClient } = await import('@deepgram/sdk');
    const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

    // Simple balance check (doesn't consume credits)
    const { result, error } = await deepgram.manage.getBalances();

    if (error) {
      throw new Error(error.message);
    }

    console.log('✅ Deepgram: API key valid');
    return true;
  } catch (error) {
    console.error('❌ Deepgram:', error.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// 3. Cartesia
// ─────────────────────────────────────────────────────────────────────

async function testCartesia() {
  try {
    const { Cartesia } = await import('@cartesia/cartesia-js');
    const cartesia = new Cartesia({ apiKey: process.env.CARTESIA_API_KEY });

    // List voices to verify API key
    const voices = await cartesia.voices.list();

    console.log('✅ Cartesia: API key valid (' + voices.length + ' voices available)');

    // Verify voice ID exists
    const voiceId = process.env.CARTESIA_DEFAULT_VOICE_ID;
    const voice = voices.find((v) => v.id === voiceId);

    if (voice) {
      console.log('   ✅ Voice ID valid: "' + voice.name + '"');
    } else {
      console.warn('   ⚠️  Voice ID not found');
      console.log('   Available voice IDs:');
      voices.slice(0, 5).forEach((v) => console.log('     - ' + v.id + ' (' + v.name + ')'));
    }

    return true;
  } catch (error) {
    console.error('❌ Cartesia:', error.message);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Run Tests
// ─────────────────────────────────────────────────────────────────────

(async function main() {
  const results = {
    openai: await testOpenAI(),
    deepgram: await testDeepgram(),
    cartesia: await testCartesia(),
  };

  console.log('\n' + '─'.repeat(60));

  const allPass = Object.values(results).every((r) => r === true);

  if (allPass) {
    console.log('✅ ALL API KEYS VERIFIED - Ready for live mode!');
    console.log('\nNext: Implement live integrations in:');
    console.log('  - src/lib/voice/intent-tone.ts');
    console.log('  - src/lib/voice/dialogue.ts');
    console.log('  - src/lib/voice/asr.ts');
    console.log('  - src/lib/voice/tts.ts');
  } else {
    console.log('❌ Some API keys failed verification');
    console.log('\nCheck your .env.local file and try again.');
    process.exit(1);
  }
})();
