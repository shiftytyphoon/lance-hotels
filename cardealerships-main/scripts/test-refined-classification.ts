#!/usr/bin/env node
/**
 * Test Refined Intent/Tone Classification
 *
 * Tests the refined prompt on all 15 example utterances
 */

import { default as OpenAI } from 'openai';

const REFINED_PROMPT_TEMPLATE = `You are an intent and tone classifier for a hotel voice assistant. Analyze the guest's utterance and respond with strict JSON.

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

CONTEXT: (No prior conversation)

USER UTTERANCE: "{transcript}"

Respond with ONLY valid JSON matching this exact structure. Do not include explanations.`;

const TEST_UTTERANCES = [
  "I need a room for tonight with two beds.",
  "Can I extend my stay by one night?",
  "What time is check-out?",
  "Do you have airport shuttle service?",
  "My room is freezing and the heater won't turn on.",
  "I've been waiting 30 minutes for room service.",
  "Can I get extra towels sent to my room?",
  "I need a late check-out if possible.",
  "Can I speak to a manager?",
  "What's some good food nearby?",
  "You sound like a robot.",
  "I think I was overcharged on my bill.",
  "Is the pool still open right now?",
  "I want to cancel my reservation for tomorrow.",
  "Thanks, you've been super helpful.",
];

async function classifyUtterance(openai: OpenAI, utterance: string) {
  const prompt = REFINED_PROMPT_TEMPLATE.replace('{transcript}', utterance);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 250,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

async function main() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  Testing Refined Intent/Tone Classification');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const results: any[] = [];

  for (let i = 0; i < TEST_UTTERANCES.length; i++) {
    const utterance = TEST_UTTERANCES[i];
    console.log(`[${i + 1}/15] Testing: "${utterance}"`);

    try {
      const classification = await classifyUtterance(openai, utterance);
      results.push({
        num: i + 1,
        utterance,
        ...classification,
      });

      console.log(`   ✅ Intent: ${classification.intent} | Emotion: ${classification.emotion} | Urgency: ${classification.urgency}\n`);
    } catch (error: any) {
      console.error(`   ❌ Error: ${error.message}\n`);
      results.push({
        num: i + 1,
        utterance,
        error: error.message,
      });
    }

    // Small delay to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Classification Results Table');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('| # | Utterance | Intent | Entities | Emotion | Sentiment | Urgency |');
  console.log('|---|-----------|--------|----------|---------|-----------|---------|');

  for (const result of results) {
    if (result.error) {
      console.log(`| ${result.num} | "${result.utterance.substring(0, 40)}..." | ERROR | - | - | - | - |`);
      continue;
    }

    const entities = JSON.stringify(result.entities).substring(0, 30);
    const utteranceShort = result.utterance.length > 45
      ? result.utterance.substring(0, 42) + '...'
      : result.utterance;

    console.log(
      `| ${result.num} | ${utteranceShort} | \`${result.intent}\` | \`${entities}...\` | ${result.emotion} | ${result.sentiment} | ${result.urgency.toFixed(1)} |`
    );
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  Full Results (JSON)');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log(JSON.stringify(results, null, 2));

  console.log('\n✅ Classification test complete!\n');
}

main().catch(console.error);
