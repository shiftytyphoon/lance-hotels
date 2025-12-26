/**
 * Voice Pipeline Metrics & Logging
 *
 * Tracks latency, costs, and performance for each conversation turn.
 */

import type { IntentType, ToneEmotion, ToneSentiment } from './types';

// ─────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────

export interface ConversationTurnMetrics {
  // Identifiers
  conversation_id: string;
  turn_id: string;
  timestamp: Date;

  // Input
  user_input: string;
  user_input_length: number;

  // ASR Metrics
  asr_latency_ms: number;
  asr_confidence: number;
  asr_provider: string;

  // Intent/Tone Metrics
  intent_latency_ms: number;
  intent_type: IntentType;
  intent_confidence: number;
  intent_provider: string;
  tone_emotion: ToneEmotion;
  tone_sentiment: ToneSentiment;
  tone_urgency: number;
  tone_politeness: number;

  // Dialogue Metrics
  dialogue_latency_ms: number;
  dialogue_provider: string;
  dialogue_model: string;
  dialogue_tokens: number;
  dialogue_response_length: number;

  // TTS Metrics
  tts_latency_ms: number;
  tts_audio_chunks: number;
  tts_audio_bytes: number;
  tts_provider: string;

  // Total Pipeline
  total_latency_ms: number;
  total_cost_usd: number;

  // Errors
  errors: string[];
}

export interface ConversationMetrics {
  conversation_id: string;
  started_at: Date;
  ended_at?: Date;
  total_turns: number;
  turns: ConversationTurnMetrics[];

  // Aggregate metrics
  avg_latency_ms: number;
  p50_latency_ms: number;
  p95_latency_ms: number;
  total_cost_usd: number;
}

export interface MetricsExportFormat {
  conversations: ConversationMetrics[];
  generated_at: Date;
  summary: {
    total_conversations: number;
    total_turns: number;
    avg_latency_ms: number;
    total_cost_usd: number;
    by_intent: Record<string, {
      count: number;
      avg_latency_ms: number;
    }>;
    by_emotion: Record<string, {
      count: number;
      avg_latency_ms: number;
    }>;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Metrics Collector
// ─────────────────────────────────────────────────────────────────────

class MetricsCollector {
  private conversations: Map<string, ConversationMetrics> = new Map();
  private currentTurnMetrics: Map<string, Partial<ConversationTurnMetrics>> = new Map();

  // Start a new conversation
  startConversation(conversationId: string): void {
    this.conversations.set(conversationId, {
      conversation_id: conversationId,
      started_at: new Date(),
      total_turns: 0,
      turns: [],
      avg_latency_ms: 0,
      p50_latency_ms: 0,
      p95_latency_ms: 0,
      total_cost_usd: 0,
    });

    console.log(`[Metrics] Started conversation: ${conversationId}`);
  }

  // Start a new turn within a conversation
  startTurn(conversationId: string, userInput: string): string {
    const turnId = crypto.randomUUID();
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      this.startConversation(conversationId);
    }

    this.currentTurnMetrics.set(turnId, {
      conversation_id: conversationId,
      turn_id: turnId,
      timestamp: new Date(),
      user_input: userInput,
      user_input_length: userInput.length,
      errors: [],
    });

    console.log(`[Metrics] Started turn ${turnId} for conversation ${conversationId}`);
    return turnId;
  }

  // Record ASR metrics
  recordASR(turnId: string, latency: number, confidence: number, provider: string): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (metrics) {
      metrics.asr_latency_ms = latency;
      metrics.asr_confidence = confidence;
      metrics.asr_provider = provider;
    }
  }

  // Record Intent/Tone metrics
  recordIntentTone(
    turnId: string,
    latency: number,
    intent: IntentType,
    intentConfidence: number,
    provider: string,
    emotion: ToneEmotion,
    sentiment: ToneSentiment,
    urgency: number,
    politeness: number
  ): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (metrics) {
      metrics.intent_latency_ms = latency;
      metrics.intent_type = intent;
      metrics.intent_confidence = intentConfidence;
      metrics.intent_provider = provider;
      metrics.tone_emotion = emotion;
      metrics.tone_sentiment = sentiment;
      metrics.tone_urgency = urgency;
      metrics.tone_politeness = politeness;
    }
  }

  // Record Dialogue metrics
  recordDialogue(
    turnId: string,
    latency: number,
    provider: string,
    model: string,
    tokens: number,
    responseLength: number
  ): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (metrics) {
      metrics.dialogue_latency_ms = latency;
      metrics.dialogue_provider = provider;
      metrics.dialogue_model = model;
      metrics.dialogue_tokens = tokens;
      metrics.dialogue_response_length = responseLength;
    }
  }

  // Record TTS metrics
  recordTTS(
    turnId: string,
    latency: number,
    audioChunks: number,
    audioBytes: number,
    provider: string
  ): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (metrics) {
      metrics.tts_latency_ms = latency;
      metrics.tts_audio_chunks = audioChunks;
      metrics.tts_audio_bytes = audioBytes;
      metrics.tts_provider = provider;
    }
  }

  // Record error
  recordError(turnId: string, error: string): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (metrics) {
      metrics.errors = metrics.errors || [];
      metrics.errors.push(error);
    }
  }

  // Complete a turn and calculate totals
  completeTurn(turnId: string): void {
    const metrics = this.currentTurnMetrics.get(turnId);
    if (!metrics || !metrics.conversation_id) {
      console.warn(`[Metrics] Turn ${turnId} not found or missing conversation_id`);
      return;
    }

    // Calculate total latency
    const totalLatency =
      (metrics.asr_latency_ms || 0) +
      (metrics.intent_latency_ms || 0) +
      (metrics.dialogue_latency_ms || 0) +
      (metrics.tts_latency_ms || 0);

    metrics.total_latency_ms = totalLatency;

    // Calculate cost (approximate)
    const cost = this.calculateCost(metrics);
    metrics.total_cost_usd = cost;

    // Add to conversation
    const conversation = this.conversations.get(metrics.conversation_id);
    if (conversation) {
      conversation.turns.push(metrics as ConversationTurnMetrics);
      conversation.total_turns++;
      conversation.total_cost_usd += cost;

      // Recalculate aggregates
      const latencies = conversation.turns.map(t => t.total_latency_ms).sort((a, b) => a - b);
      conversation.avg_latency_ms = latencies.reduce((sum, l) => sum + l, 0) / latencies.length;
      conversation.p50_latency_ms = latencies[Math.floor(latencies.length * 0.5)] || 0;
      conversation.p95_latency_ms = latencies[Math.floor(latencies.length * 0.95)] || 0;
    }

    this.currentTurnMetrics.delete(turnId);

    console.log(`[Metrics] Completed turn ${turnId}: ${totalLatency}ms, $${cost.toFixed(6)}`);
  }

  // End a conversation
  endConversation(conversationId: string): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.ended_at = new Date();
      console.log(`[Metrics] Ended conversation ${conversationId}: ${conversation.total_turns} turns, $${conversation.total_cost_usd.toFixed(4)}`);
    }
  }

  // Get conversation metrics
  getConversation(conversationId: string): ConversationMetrics | undefined {
    return this.conversations.get(conversationId);
  }

  // Get all conversations
  getAllConversations(): ConversationMetrics[] {
    return Array.from(this.conversations.values());
  }

  // Export all metrics
  export(): MetricsExportFormat {
    const conversations = this.getAllConversations();
    const allTurns = conversations.flatMap(c => c.turns);

    // Calculate summary
    const byIntent: Record<string, { count: number; totalLatency: number }> = {};
    const byEmotion: Record<string, { count: number; totalLatency: number }> = {};

    allTurns.forEach(turn => {
      // By intent
      const intent = turn.intent_type;
      if (!byIntent[intent]) {
        byIntent[intent] = { count: 0, totalLatency: 0 };
      }
      byIntent[intent].count++;
      byIntent[intent].totalLatency += turn.total_latency_ms;

      // By emotion
      const emotion = turn.tone_emotion;
      if (!byEmotion[emotion]) {
        byEmotion[emotion] = { count: 0, totalLatency: 0 };
      }
      byEmotion[emotion].count++;
      byEmotion[emotion].totalLatency += turn.total_latency_ms;
    });

    // Convert to averages
    const byIntentAvg: Record<string, { count: number; avg_latency_ms: number }> = {};
    Object.entries(byIntent).forEach(([intent, stats]) => {
      byIntentAvg[intent] = {
        count: stats.count,
        avg_latency_ms: stats.totalLatency / stats.count,
      };
    });

    const byEmotionAvg: Record<string, { count: number; avg_latency_ms: number }> = {};
    Object.entries(byEmotion).forEach(([emotion, stats]) => {
      byEmotionAvg[emotion] = {
        count: stats.count,
        avg_latency_ms: stats.totalLatency / stats.count,
      };
    });

    const totalCost = conversations.reduce((sum, c) => sum + c.total_cost_usd, 0);
    const avgLatency = allTurns.length > 0
      ? allTurns.reduce((sum, t) => sum + t.total_latency_ms, 0) / allTurns.length
      : 0;

    return {
      conversations,
      generated_at: new Date(),
      summary: {
        total_conversations: conversations.length,
        total_turns: allTurns.length,
        avg_latency_ms: avgLatency,
        total_cost_usd: totalCost,
        by_intent: byIntentAvg,
        by_emotion: byEmotionAvg,
      },
    };
  }

  // Clear all metrics
  clear(): void {
    this.conversations.clear();
    this.currentTurnMetrics.clear();
    console.log('[Metrics] Cleared all metrics');
  }

  // Calculate cost for a turn
  private calculateCost(metrics: Partial<ConversationTurnMetrics>): number {
    let cost = 0;

    // ASR: Deepgram Nova-2 @ $0.0043/min
    // Assume average utterance is 5 seconds = 0.083 minutes
    const asrMinutes = 0.083;
    cost += asrMinutes * 0.0043;

    // Intent/Tone: OpenAI GPT-4o-mini
    // $0.150 / 1M input tokens, $0.600 / 1M output tokens
    // Assume ~500 input tokens, ~50 output tokens per call
    cost += (500 * 0.150 / 1_000_000) + (50 * 0.600 / 1_000_000);

    // Dialogue: OpenAI GPT-4o
    // $2.50 / 1M input tokens, $10.00 / 1M output tokens
    // Use actual tokens if available
    const dialogueTokens = metrics.dialogue_tokens || 800; // default estimate
    const inputTokens = dialogueTokens * 0.7; // rough split
    const outputTokens = dialogueTokens * 0.3;
    cost += (inputTokens * 2.50 / 1_000_000) + (outputTokens * 10.00 / 1_000_000);

    // TTS: Cartesia Sonic @ ~$0.05/min of audio
    // Assume response is ~10 seconds = 0.167 minutes
    const ttsMinutes = 0.167;
    cost += ttsMinutes * 0.05;

    return cost;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Singleton Export
// ─────────────────────────────────────────────────────────────────────

export const metricsCollector = new MetricsCollector();

// ─────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────

export function exportMetricsToJSON(): string {
  return JSON.stringify(metricsCollector.export(), null, 2);
}

export function exportMetricsToCSV(): string {
  const data = metricsCollector.export();
  const turns = data.conversations.flatMap(c => c.turns);

  // CSV Header
  const headers = [
    'conversation_id',
    'turn_id',
    'timestamp',
    'user_input',
    'asr_latency_ms',
    'asr_confidence',
    'intent_latency_ms',
    'intent_type',
    'intent_confidence',
    'tone_emotion',
    'tone_sentiment',
    'tone_urgency',
    'dialogue_latency_ms',
    'dialogue_model',
    'dialogue_tokens',
    'tts_latency_ms',
    'tts_audio_chunks',
    'total_latency_ms',
    'total_cost_usd',
    'errors',
  ];

  const rows = turns.map(turn => [
    turn.conversation_id,
    turn.turn_id,
    turn.timestamp.toISOString(),
    `"${turn.user_input.replace(/"/g, '""')}"`, // Escape quotes
    turn.asr_latency_ms,
    turn.asr_confidence,
    turn.intent_latency_ms,
    turn.intent_type,
    turn.intent_confidence,
    turn.tone_emotion,
    turn.tone_sentiment,
    turn.tone_urgency,
    turn.dialogue_latency_ms,
    turn.dialogue_model,
    turn.dialogue_tokens,
    turn.tts_latency_ms,
    turn.tts_audio_chunks,
    turn.total_latency_ms,
    turn.total_cost_usd.toFixed(6),
    turn.errors.length > 0 ? `"${turn.errors.join('; ')}"` : '',
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
