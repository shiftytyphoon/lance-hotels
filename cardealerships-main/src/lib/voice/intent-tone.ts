/**
 * Intent & Tone Classifier
 *
 * Classifies user intent and emotional tone from transcripts.
 * Uses OpenAI GPT-4o mini (primary) or Anthropic Claude Haiku (optional).
 *
 * Usage:
 *   const classifier = getIntentToneService();
 *   const result = await classifier.classify(transcript, history);
 *   console.log(result.intent.type, result.tone.emotion);
 */

import type {
  IIntentToneService,
  IntentToneResult,
  ConversationMessage,
} from './types';
import { IntentType, ToneEmotion, ToneSentiment } from './types';
import { isLiveMode, voiceConfig } from './config';

// ─────────────────────────────────────────────────────────────────────
// Stub Implementation
// ─────────────────────────────────────────────────────────────────────

class StubIntentToneService implements IIntentToneService {
  private intents: IntentType[] = [
    IntentType.BOOK_ROOM,
    IntentType.CHECK_AVAILABILITY,
    IntentType.ASK_AMENITIES,
    IntentType.ASK_PRICING,
    IntentType.GREETING,
  ];
  private emotions: ToneEmotion[] = [
    ToneEmotion.NEUTRAL,
    ToneEmotion.HAPPY,
    ToneEmotion.CONFUSED,
    ToneEmotion.URGENT,
    ToneEmotion.FRUSTRATED,
    ToneEmotion.ANGRY,
    ToneEmotion.GRATEFUL,
  ];
  private callCount = 0;

  async classify(
    transcript: string,
    conversationHistory: ConversationMessage[]
  ): Promise<IntentToneResult> {
    console.log(`[IntentTone:Stub] Classifying: "${transcript}"`);

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 50));

    // Simple keyword-based mock classification
    const lowerTranscript = transcript.toLowerCase();
    let intent: IntentType = IntentType.UNCLEAR;
    let emotion: ToneEmotion = ToneEmotion.NEUTRAL;
    let urgency = 0.3;

    if (lowerTranscript.includes('book') || lowerTranscript.includes('reservation')) {
      intent = IntentType.BOOK_ROOM;
    } else if (lowerTranscript.includes('availability') || lowerTranscript.includes('available')) {
      intent = IntentType.CHECK_AVAILABILITY;
    } else if (lowerTranscript.includes('amenities') || lowerTranscript.includes('facilities')) {
      intent = IntentType.ASK_AMENITIES;
    } else if (lowerTranscript.includes('price') || lowerTranscript.includes('cost')) {
      intent = IntentType.ASK_PRICING;
    } else if (lowerTranscript.includes('hello') || lowerTranscript.includes('hi')) {
      intent = IntentType.GREETING;
      emotion = ToneEmotion.HAPPY;
    }

    // Detect urgency
    if (lowerTranscript.includes('urgent') || lowerTranscript.includes('asap')) {
      emotion = ToneEmotion.URGENT;
      urgency = 0.9;
    }

    // Detect frustration
    if (lowerTranscript.includes('problem') || lowerTranscript.includes('issue')) {
      emotion = ToneEmotion.FRUSTRATED;
      urgency = 0.7;
    }

    // Determine sentiment based on emotion
    let sentiment: ToneSentiment = ToneSentiment.NEUTRAL;
    const emotionValue = emotion as ToneEmotion; // Cast to avoid TS narrowing
    if (emotionValue === ToneEmotion.HAPPY || emotionValue === ToneEmotion.GRATEFUL) {
      sentiment = ToneSentiment.POSITIVE;
    } else if (emotionValue === ToneEmotion.FRUSTRATED || emotionValue === ToneEmotion.ANGRY) {
      sentiment = ToneSentiment.NEGATIVE;
    }

    this.callCount++;

    return {
      intent: {
        type: intent,
        confidence: 0.85,
        entities: this.extractMockEntities(transcript, intent),
        model_used: 'stub-classifier',
        latency_ms: 50,
      },
      tone: {
        emotion,
        sentiment,
        urgency_score: urgency,
        politeness_score: 0.8,
        confidence: 0.8,
        model_used: 'stub-classifier',
        latency_ms: 50,
      },
    };
  }

  private extractMockEntities(transcript: string, intent: IntentType): Record<string, any> {
    const entities: Record<string, any> = {};

    // Mock entity extraction
    if (intent === 'book_room' || intent === 'check_availability') {
      const dateMatch = transcript.match(/next\s+(\w+)/i);
      if (dateMatch) {
        entities.check_in_date = '2025-01-15'; // Mock date
        entities.check_out_date = '2025-01-18';
      }

      const guestsMatch = transcript.match(/(\d+)\s+(guest|people|person)/i);
      if (guestsMatch) {
        entities.guests = parseInt(guestsMatch[1]);
      } else {
        entities.guests = 2; // Default
      }
    }

    return entities;
  }
}

// ─────────────────────────────────────────────────────────────────────
// OpenAI Implementation
// ─────────────────────────────────────────────────────────────────────

class OpenAIIntentToneService implements IIntentToneService {
  async classify(
    transcript: string,
    conversationHistory: ConversationMessage[]
  ): Promise<IntentToneResult> {
    const startTime = Date.now();

    // Dynamic import to avoid issues in edge runtime
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: voiceConfig.getApiKey('openai') });

    const prompt = this.buildPrompt(transcript, conversationHistory);

    console.log(`[IntentTone:OpenAI] Classifying: "${transcript}"`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 250,
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content!);
    const latency = Date.now() - startTime;

    console.log(`[IntentTone:OpenAI] Result: ${result.intent} (${latency}ms)`);

    return {
      intent: {
        type: result.intent as IntentType,
        confidence: result.confidence || 0.9,
        entities: result.entities || {},
        model_used: 'gpt-4o-mini',
        latency_ms: latency,
      },
      tone: {
        emotion: result.emotion as ToneEmotion,
        sentiment: result.sentiment as ToneSentiment,
        urgency_score: result.urgency || 0.3,
        politeness_score: result.politeness || 0.8,
        confidence: result.confidence || 0.85,
        model_used: 'gpt-4o-mini',
        latency_ms: latency,
      },
    };
  }

  private buildPrompt(transcript: string, history: ConversationMessage[]): string {
    const contextLines = history.length > 0
      ? history.slice(-3).map(m => `${m.role}: ${m.content}`).join('\n')
      : '(No prior conversation)';

    return `You are an intent and tone classifier for a hotel voice assistant. Analyze the guest's utterance and respond with strict JSON.

INTENT TYPES (choose exactly one):

Booking & Reservations:
- "book_room" - Guest wants to reserve a room
- "modify_reservation" - Change existing booking (dates, room type, guests)
- "cancel_reservation" - Cancel a booking
- "check_availability" - Ask if rooms are available

Information Requests:
- "ask_amenities" - Questions about hotel facilities (pool, gym, wifi, parking, shuttle)
- "ask_hours" - When is X open? What time is check-in/check-out?
- "ask_location" - Where is the hotel? How do I get there?
- "ask_pricing" - How much does X cost? Room rates?
- "ask_recommendations" - What restaurants/attractions/activities nearby?

Support & Services:
- "report_issue" - Something is broken, not working, or wrong with the room
- "request_service" - Need housekeeping, towels, room service, wake-up call, late checkout
- "billing_inquiry" - Questions about charges, payment, invoice, refunds
- "transfer_to_human" - Explicitly ask for manager, staff, or escalation
- "meta_feedback" - Feedback about this AI assistant (not understanding, sounds robotic)

Conversation:
- "greeting" - Hello, hi, good morning
- "acknowledgment" - Thanks, got it, that helps, you've been helpful (mid-conversation)
- "farewell" - Goodbye, bye, that's all (ending conversation)
- "unclear" - Cannot determine intent

TONE DIMENSIONS:

1. emotion (string): "neutral" | "happy" | "frustrated" | "confused" | "urgent" | "angry" | "grateful" | "concerned"

2. sentiment (string): "positive" | "neutral" | "negative"

3. urgency (number): 0.0 (casual) to 1.0 (emergency)
   - 0.0-0.3: Casual inquiry
   - 0.4-0.6: Normal request
   - 0.7-0.9: High priority
   - 1.0: Emergency

4. politeness (number): 0.0 (rude/demanding) to 1.0 (very polite)

5. confidence (number): 0.0 to 1.0 (how confident you are in this classification)

ENTITY EXTRACTION:

Extract relevant entities into the "entities" object:
- Dates: "check_in_date", "check_out_date" (ISO format if possible)
- Numbers: "guests", "nights", "room_count"
- Types: "room_type" (standard, deluxe, suite)
- Amenities: "amenity_name" (pool, gym, wifi, etc.)
- Issues: "issue_type" (heating, AC, plumbing, noise)
- Services: "service_type" (towels, room service, housekeeping)

DISAMBIGUATION RULES:

- If guest says "I need X" where X is a service → request_service
- If guest says "X is broken/not working" → report_issue
- If guest mentions waiting/delays for service → report_issue (not request_service)
- If guest gives feedback about this assistant → meta_feedback (not transfer_to_human)
- If guest says thanks but doesn't explicitly end conversation → acknowledgment (not farewell)
- If guest asks "where can I find..." about non-hotel locations → ask_recommendations

EXAMPLES:

Input: "I need a room for tonight with two beds."
Output: {
  "intent": "book_room",
  "entities": { "check_in_date": "tonight", "beds": 2 },
  "emotion": "neutral",
  "sentiment": "neutral",
  "urgency": 0.6,
  "politeness": 0.7,
  "confidence": 0.95
}

Input: "My room is freezing and the heater won't turn on."
Output: {
  "intent": "report_issue",
  "entities": { "issue_type": "heating", "severity": "high" },
  "emotion": "frustrated",
  "sentiment": "negative",
  "urgency": 0.75,
  "politeness": 0.6,
  "confidence": 0.98
}

Input: "Can I get extra towels sent to my room?"
Output: {
  "intent": "request_service",
  "entities": { "service_type": "towels" },
  "emotion": "neutral",
  "sentiment": "neutral",
  "urgency": 0.4,
  "politeness": 0.9,
  "confidence": 0.95
}

Input: "What's some good food nearby?"
Output: {
  "intent": "ask_recommendations",
  "entities": { "category": "restaurants" },
  "emotion": "neutral",
  "sentiment": "neutral",
  "urgency": 0.3,
  "politeness": 0.7,
  "confidence": 0.92
}

Input: "You sound like a robot."
Output: {
  "intent": "meta_feedback",
  "entities": { "feedback_type": "system_quality" },
  "emotion": "confused",
  "sentiment": "negative",
  "urgency": 0.2,
  "politeness": 0.5,
  "confidence": 0.88
}

CONTEXT:
${contextLines}

USER UTTERANCE: "${transcript}"

Respond with ONLY valid JSON matching this exact structure. Do not include explanations.`;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Anthropic Implementation (Optional)
// ─────────────────────────────────────────────────────────────────────

class AnthropicIntentToneService implements IIntentToneService {
  async classify(
    transcript: string,
    conversationHistory: ConversationMessage[]
  ): Promise<IntentToneResult> {
    // TODO: Implement Anthropic Claude Haiku call
    // Similar to OpenAI but using @anthropic-ai/sdk
    console.log(`[IntentTone:Anthropic] TODO: Classify: "${transcript}"`);
    throw new Error('Anthropic integration not yet implemented - install @anthropic-ai/sdk');
  }
}

// ─────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────

export function getIntentToneService(): IIntentToneService {
  if (isLiveMode()) {
    const provider = voiceConfig.getLLMProvider();

    if (provider === 'openai') {
      return new OpenAIIntentToneService();
    } else {
      return new AnthropicIntentToneService();
    }
  }

  return new StubIntentToneService();
}
