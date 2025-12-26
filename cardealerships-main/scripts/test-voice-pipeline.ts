#!/usr/bin/env node
/**
 * Voice Pipeline Test Script
 *
 * Tests the full pipeline: text → intent/tone → dialogue using OpenAI
 *
 * Usage:
 *   node --env-file=.env.local scripts/test-voice-pipeline.mjs
 *   node --env-file=.env.local scripts/test-voice-pipeline.mjs "I need a room for tonight"
 */

// Import voice services directly (no .ts extension for tsx)
import { getIntentToneService } from '../src/lib/voice/intent-tone';
import { getDialogueService } from '../src/lib/voice/dialogue';

// Test input (from CLI or default)
const userInput = process.argv[2] || "I need a room for tonight with two beds";

console.log('═══════════════════════════════════════════════════════════════');
console.log('  Voice Pipeline Test (OpenAI Live Integration)');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('📝 User input:', userInput);
console.log('');

// Mock hotel context
const hotelContext = {
  name: 'Lance Grand Hotel',
  amenities: ['rooftop pool', 'fitness center', 'spa', 'restaurant', 'free wifi'],
  policies: {
    check_in_time: '3:00 PM',
    check_out_time: '11:00 AM',
  },
};

(async function main() {
  try {
    // ─────────────────────────────────────────────────────────────────
    // Step 1: Intent & Tone Classification
    // ─────────────────────────────────────────────────────────────────
    console.log('🔍 Step 1: Classifying intent and tone...\n');

    const intentToneService = getIntentToneService();
    const classification = await intentToneService.classify(userInput, []);

    console.log('✅ Classification complete!\n');
    console.log('   Intent:', classification.intent.type);
    console.log('   Confidence:', (classification.intent.confidence * 100).toFixed(1) + '%');
    console.log('   Entities:', JSON.stringify(classification.intent.entities, null, 2));
    console.log('');
    console.log('   Emotion:', classification.tone.emotion);
    console.log('   Sentiment:', classification.tone.sentiment);
    console.log('   Urgency:', (classification.tone.urgency_score * 100).toFixed(1) + '%');
    console.log('   Politeness:', (classification.tone.politeness_score * 100).toFixed(1) + '%');
    console.log('');
    console.log('   ⏱️  Latency:', classification.intent.latency_ms + 'ms');
    console.log('   🤖 Model:', classification.intent.model_used);
    console.log('');

    // ─────────────────────────────────────────────────────────────────
    // Step 2: Dialogue Generation
    // ─────────────────────────────────────────────────────────────────
    console.log('💬 Step 2: Generating dialogue response...\n');

    const dialogueService = getDialogueService();

    const dialogueRequest = {
      userMessage: userInput,
      intent: {
        ...classification.intent,
        id: 'test-intent-' + Date.now(),
        utterance_id: 'test-utterance-' + Date.now(),
        extracted_at: new Date(),
      },
      tone: {
        ...classification.tone,
        id: 'test-tone-' + Date.now(),
        utterance_id: 'test-utterance-' + Date.now(),
        detected_at: new Date(),
      },
      hotelContext,
      conversationHistory: [],
    };

    const dialogueResponse = await dialogueService.generate(dialogueRequest);

    console.log('✅ Response generated!\n');
    console.log('   📢 Assistant:', dialogueResponse.text);
    console.log('');
    console.log('   ⏱️  Latency:', dialogueResponse.latency_ms + 'ms');
    console.log('   🔢 Tokens:', dialogueResponse.total_tokens);
    console.log('   🤖 Model:', dialogueResponse.model);
    console.log('');

    // ─────────────────────────────────────────────────────────────────
    // Step 3: Streaming Test (Optional)
    // ─────────────────────────────────────────────────────────────────
    console.log('🌊 Step 3: Testing streaming dialogue...\n');
    console.log('   📢 Assistant (streaming): ');
    process.stdout.write('      ');

    const streamedResponse = await dialogueService.generateStreaming(
      dialogueRequest,
      (token) => process.stdout.write(token)
    );

    console.log('\n');
    console.log('   ⏱️  First token latency:', streamedResponse.latency_ms + 'ms');
    console.log('');

    // ─────────────────────────────────────────────────────────────────
    // Summary
    // ─────────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Pipeline Complete!');
    console.log('═══════════════════════════════════════════════════════════════\n');

    console.log('📊 Performance Summary:');
    console.log('   Intent/Tone: ' + classification.intent.latency_ms + 'ms');
    console.log('   Dialogue: ' + dialogueResponse.latency_ms + 'ms');
    console.log('   Streaming: ' + streamedResponse.latency_ms + 'ms (first token)');
    const totalLatency = classification.intent.latency_ms + dialogueResponse.latency_ms;
    console.log('   ─────────────────────────────');
    console.log('   Total: ' + totalLatency + 'ms');
    console.log('');

    if (totalLatency < 300) {
      console.log('🎯 Excellent latency! Well under 300ms target.\n');
    } else if (totalLatency < 500) {
      console.log('✅ Good latency! Under 500ms.\n');
    } else {
      console.log('⚠️  Higher latency than expected (target: <300ms)\n');
    }

    console.log('💡 Try other inputs:');
    console.log('   node --env-file=.env.local scripts/test-voice-pipeline.mjs "What amenities do you have?"');
    console.log('   node --env-file=.env.local scripts/test-voice-pipeline.mjs "I have a problem with my room"');
    console.log('   node --env-file=.env.local scripts/test-voice-pipeline.mjs "Book a deluxe room for 3 guests"');
    console.log('');

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
})();
