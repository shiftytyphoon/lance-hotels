#!/usr/bin/env tsx
/**
 * Batch Voice Pipeline Testing
 *
 * Runs scripted conversations through the voice pipeline and collects metrics.
 * Outputs results to JSON and CSV for analysis.
 *
 * Usage:
 *   npm run test:batch
 *   npm run test:batch -- --conversations 3
 *   npm run test:batch -- --output results/
 */

import fs from 'fs';
import path from 'path';
import { getIntentToneService } from '../src/lib/voice/intent-tone';
import { getDialogueService } from '../src/lib/voice/dialogue';
import { getTTSService } from '../src/lib/voice/tts';
import { metricsCollector, exportMetricsToJSON, exportMetricsToCSV } from '../src/lib/voice/metrics';
import type { ConversationMessage, IntentType } from '../src/lib/voice/types';

// ─────────────────────────────────────────────────────────────────────
// Test Conversation Type
// ─────────────────────────────────────────────────────────────────────

interface TestConversation {
  id: string;
  description: string;
  turns: string[];
}

// ─────────────────────────────────────────────────────────────────────
// Load Test Conversations
// ─────────────────────────────────────────────────────────────────────

function loadTestConversations(filePath: string): TestConversation[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

// ─────────────────────────────────────────────────────────────────────
// Run Single Conversation
// ─────────────────────────────────────────────────────────────────────

async function runConversation(
  conversation: TestConversation,
  conversationNumber: number,
  totalConversations: number
): Promise<void> {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`[${conversationNumber}/${totalConversations}] ${conversation.description}`);
  console.log(`Conversation ID: ${conversation.id}`);
  console.log(`${'='.repeat(80)}\n`);

  const conversationId = `test-${conversation.id}-${Date.now()}`;
  const conversationHistory: ConversationMessage[] = [];

  // Initialize services
  const intentTone = getIntentToneService();
  const dialogue = getDialogueService();
  const tts = getTTSService();

  // Start conversation metrics
  metricsCollector.startConversation(conversationId);

  // Process each turn
  for (let i = 0; i < conversation.turns.length; i++) {
    const userInput = conversation.turns[i];
    console.log(`\n[Turn ${i + 1}/${conversation.turns.length}]`);
    console.log(`User: ${userInput}`);

    // Start turn metrics
    const turnId = metricsCollector.startTurn(conversationId, userInput);

    try {
      // Step 1: ASR (simulated - in real pipeline this would be Deepgram)
      const asrStart = Date.now();
      // Simulate ASR latency for consistency
      await new Promise(resolve => setTimeout(resolve, 50));
      const asrLatency = Date.now() - asrStart;
      metricsCollector.recordASR(turnId, asrLatency, 0.95, 'stub');

      // Step 2: Intent/Tone Classification
      const intentStart = Date.now();
      const classification = await intentTone.classify(userInput, conversationHistory);
      const intentLatency = Date.now() - intentStart;

      metricsCollector.recordIntentTone(
        turnId,
        intentLatency,
        classification.intent.type,
        classification.intent.confidence,
        classification.intent.model_used,
        classification.tone.emotion,
        classification.tone.sentiment,
        classification.tone.urgency_score,
        classification.tone.politeness_score
      );

      console.log(`  Intent: ${classification.intent.type} (${(classification.intent.confidence * 100).toFixed(1)}%)`);
      console.log(`  Tone: ${classification.tone.emotion} / ${classification.tone.sentiment}`);
      console.log(`  Urgency: ${classification.tone.urgency_score.toFixed(2)}, Politeness: ${classification.tone.politeness_score.toFixed(2)}`);

      // Step 3: Dialogue Generation
      const dialogueStart = Date.now();
      const dialogueResponse = await dialogue.generate({
        userMessage: userInput,
        intent: {
          ...classification.intent,
          id: crypto.randomUUID(),
          utterance_id: crypto.randomUUID(),
          extracted_at: new Date(),
        },
        tone: {
          ...classification.tone,
          id: crypto.randomUUID(),
          utterance_id: crypto.randomUUID(),
          detected_at: new Date(),
        },
        hotelContext: {
          name: 'Lance Hotels',
          amenities: ['Pool', 'Gym', 'Free WiFi', 'Parking', 'Restaurant', 'Spa'],
          policies: {
            checkIn: '3:00 PM',
            checkOut: '11:00 AM',
            cancellation: '24 hours before arrival',
            petPolicy: 'Pets allowed with $50 fee',
            parking: 'Free self-parking',
          },
        },
        conversationHistory,
      });
      const dialogueLatency = Date.now() - dialogueStart;

      metricsCollector.recordDialogue(
        turnId,
        dialogueLatency,
        'openai',
        dialogueResponse.model,
        dialogueResponse.total_tokens,
        dialogueResponse.text.length
      );

      console.log(`  Assistant: ${dialogueResponse.text}`);

      // Update conversation history
      conversationHistory.push(
        { role: 'user', content: userInput, timestamp: new Date() },
        { role: 'assistant', content: dialogueResponse.text, timestamp: new Date() }
      );

      // Step 4: TTS (simulated or real based on mode)
      const ttsStart = Date.now();
      let audioChunks = 0;
      let audioBytes = 0;

      await tts.synthesizeStreaming(
        {
          text: dialogueResponse.text,
          voice_id: process.env.CARTESIA_DEFAULT_VOICE_ID || 'stub',
          prosody_hints: {
            emotion: classification.tone.emotion,
            speed: 1.0,
          },
        },
        (chunk) => {
          audioChunks++;
          audioBytes += chunk.data.length;
        }
      );

      const ttsLatency = Date.now() - ttsStart;

      metricsCollector.recordTTS(
        turnId,
        ttsLatency,
        audioChunks,
        audioBytes,
        process.env.VOICE_STACK_MODE === 'live' ? 'cartesia' : 'stub'
      );

      // Complete turn
      metricsCollector.completeTurn(turnId);

      // Show timing
      console.log(`\n  ⏱️  Latencies:`);
      console.log(`    ASR:      ${asrLatency}ms`);
      console.log(`    Intent:   ${intentLatency}ms`);
      console.log(`    Dialogue: ${dialogueLatency}ms`);
      console.log(`    TTS:      ${ttsLatency}ms`);
      console.log(`    TOTAL:    ${asrLatency + intentLatency + dialogueLatency + ttsLatency}ms`);

    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`);
      metricsCollector.recordError(turnId, error.message);
      metricsCollector.completeTurn(turnId);
    }

    // Brief pause between turns
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // End conversation
  metricsCollector.endConversation(conversationId);

  const conversationMetrics = metricsCollector.getConversation(conversationId);
  if (conversationMetrics) {
    console.log(`\n📊 Conversation Summary:`);
    console.log(`  Turns: ${conversationMetrics.total_turns}`);
    console.log(`  Avg Latency: ${conversationMetrics.avg_latency_ms.toFixed(0)}ms`);
    console.log(`  P50 Latency: ${conversationMetrics.p50_latency_ms.toFixed(0)}ms`);
    console.log(`  P95 Latency: ${conversationMetrics.p95_latency_ms.toFixed(0)}ms`);
    console.log(`  Total Cost: $${conversationMetrics.total_cost_usd.toFixed(4)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🧪 Voice Pipeline Batch Testing\n');

  // Parse arguments
  const args = process.argv.slice(2);
  let maxConversations: number | null = null;
  let outputDir = 'test-results';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--conversations' && args[i + 1]) {
      maxConversations = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    }
  }

  // Load test conversations
  const conversationsFile = path.join(__dirname, 'test-conversations.json');
  let allConversations = loadTestConversations(conversationsFile);

  if (maxConversations) {
    allConversations = allConversations.slice(0, maxConversations);
  }

  console.log(`📝 Loaded ${allConversations.length} test conversations`);
  console.log(`🔧 Mode: ${process.env.VOICE_STACK_MODE || 'stub'}`);
  console.log(`📁 Output: ${outputDir}\n`);

  // Clear previous metrics
  metricsCollector.clear();

  // Run all conversations
  const startTime = Date.now();

  for (let i = 0; i < allConversations.length; i++) {
    await runConversation(allConversations[i], i + 1, allConversations.length);
  }

  const totalTime = Date.now() - startTime;

  // Export results
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 BATCH TEST COMPLETE');
  console.log(`${'='.repeat(80)}\n`);

  const metrics = metricsCollector.export();

  console.log(`Summary:`);
  console.log(`  Total Conversations: ${metrics.summary.total_conversations}`);
  console.log(`  Total Turns: ${metrics.summary.total_turns}`);
  console.log(`  Avg Latency: ${metrics.summary.avg_latency_ms.toFixed(0)}ms`);
  console.log(`  Total Cost: $${metrics.summary.total_cost_usd.toFixed(4)}`);
  console.log(`  Total Time: ${(totalTime / 1000).toFixed(1)}s\n`);

  console.log(`By Intent:`);
  Object.entries(metrics.summary.by_intent)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([intent, stats]) => {
      console.log(`  ${intent.padEnd(25)} ${stats.count.toString().padStart(3)} calls, ${stats.avg_latency_ms.toFixed(0).padStart(5)}ms avg`);
    });

  console.log(`\nBy Emotion:`);
  Object.entries(metrics.summary.by_emotion)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([emotion, stats]) => {
      console.log(`  ${emotion.padEnd(25)} ${stats.count.toString().padStart(3)} calls, ${stats.avg_latency_ms.toFixed(0).padStart(5)}ms avg`);
    });

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export JSON
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const jsonFile = path.join(outputDir, `metrics-${timestamp}.json`);
  fs.writeFileSync(jsonFile, exportMetricsToJSON(), 'utf-8');
  console.log(`\n✅ JSON exported: ${jsonFile}`);

  // Export CSV
  const csvFile = path.join(outputDir, `metrics-${timestamp}.csv`);
  fs.writeFileSync(csvFile, exportMetricsToCSV(), 'utf-8');
  console.log(`✅ CSV exported: ${csvFile}`);

  console.log(`\n✨ Done!\n`);
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
