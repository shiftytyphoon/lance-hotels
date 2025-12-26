/**
 * Dialogue Manager (LLM-based Response Generation)
 *
 * Generates natural language responses using OpenAI GPT-4o or Claude Sonnet.
 */

import type { IDialogueService, DialogueRequest, DialogueResponse } from './types';
import { isLiveMode, voiceConfig } from './config';

// ─────────────────────────────────────────────────────────────────────
// Stub Implementation
// ─────────────────────────────────────────────────────────────────────

class StubDialogueService implements IDialogueService {
  private responses = [
    "Hello! Welcome to our hotel. How can I help you today?",
    "We have several rooms available for those dates. Would you like a standard or deluxe room?",
    "Our hotel features a rooftop pool, fitness center, and complimentary breakfast.",
    "Great choice! Let me get that booked for you right away.",
    "Is there anything else I can help you with?",
  ];
  private responseIndex = 0;

  async generate(request: DialogueRequest): Promise<DialogueResponse> {
    console.log(`[Dialogue:Stub] Generating response for intent: ${request.intent.type}`);

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 120));

    const text = this.responses[this.responseIndex % this.responses.length];
    this.responseIndex++;

    return {
      text,
      latency_ms: 120,
      total_tokens: 50,
      model: 'stub-llm',
    };
  }

  async generateStreaming(
    request: DialogueRequest,
    onToken: (token: string) => void
  ): Promise<DialogueResponse> {
    const response = await this.generate(request);

    // Simulate streaming
    const words = response.text.split(' ');
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 30));
      onToken(word + ' ');
    }

    return response;
  }
}

// ─────────────────────────────────────────────────────────────────────
// OpenAI Implementation
// ─────────────────────────────────────────────────────────────────────

class OpenAIDialogueService implements IDialogueService {
  async generate(request: DialogueRequest): Promise<DialogueResponse> {
    const startTime = Date.now();

    // Dynamic import to avoid edge runtime issues
    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: voiceConfig.getApiKey('openai') });

    const systemPrompt = this.buildSystemPrompt(request.hotelContext, request.tone);
    const messages = this.buildMessages(request);

    console.log(`[Dialogue:OpenAI] Generating for intent: ${request.intent.type}`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const text = response.choices[0].message.content || '';
    const latency = Date.now() - startTime;

    console.log(`[Dialogue:OpenAI] Generated: "${text.substring(0, 50)}..." (${latency}ms)`);

    return {
      text,
      latency_ms: latency,
      total_tokens: response.usage?.total_tokens || 0,
      model: 'gpt-4o',
    };
  }

  async generateStreaming(
    request: DialogueRequest,
    onToken: (token: string) => void
  ): Promise<DialogueResponse> {
    const startTime = Date.now();
    let firstTokenTime: number | null = null;
    let fullText = '';

    const { default: OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: voiceConfig.getApiKey('openai') });

    const messages = this.buildMessages(request);

    console.log(`[Dialogue:OpenAI] Streaming for intent: ${request.intent.type}`);

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 150,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        if (!firstTokenTime) {
          firstTokenTime = Date.now();
        }
        fullText += content;
        onToken(content);
      }
    }

    const latency = firstTokenTime ? firstTokenTime - startTime : Date.now() - startTime;

    console.log(`[Dialogue:OpenAI] Streamed: "${fullText.substring(0, 50)}..." (${latency}ms first token)`);

    return {
      text: fullText,
      latency_ms: latency,
      total_tokens: fullText.split(/\s+/).length * 1.3, // Rough estimate
      model: 'gpt-4o',
    };
  }

  private buildSystemPrompt(hotelContext: any, tone: any): string {
    // Adjust tone based on user emotion
    let toneAdjustment = 'Maintain a warm, helpful tone.';

    if (tone.emotion === 'frustrated' || tone.emotion === 'angry') {
      toneAdjustment = 'The guest sounds frustrated. Be extra empathetic, apologize if appropriate, and focus on solutions.';
    } else if (tone.urgency_score > 0.7) {
      toneAdjustment = 'This is urgent. Respond quickly, offer immediate help, and prioritize their need.';
    } else if (tone.emotion === 'happy' || tone.emotion === 'grateful') {
      toneAdjustment = 'The guest is in a positive mood. Match their energy with warmth and enthusiasm.';
    } else if (tone.emotion === 'confused') {
      toneAdjustment = 'The guest seems confused. Be patient, clarify options clearly, and guide them step-by-step.';
    }

    return `You are a voice assistant for ${hotelContext.name}, a hotel.

${toneAdjustment}

Hotel Information:
- Amenities: ${hotelContext.amenities.join(', ')}
- Check-in time: ${hotelContext.policies.check_in_time || '3:00 PM'}
- Check-out time: ${hotelContext.policies.check_out_time || '11:00 AM'}

Important Guidelines:
1. Keep responses SHORT (1-3 sentences max) - you're speaking, not writing
2. Use natural contractions ("I'll" not "I will", "we're" not "we are")
3. Be conversational and human-like
4. If you need more info, ask ONE clarifying question
5. If you can't help, offer to transfer to a human agent
6. Never mention that you're an AI unless directly asked

Respond naturally as if speaking to a guest on the phone.`;
  }

  private buildMessages(request: DialogueRequest): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const systemPrompt = this.buildSystemPrompt(request.hotelContext, request.tone);

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history
    for (const msg of request.conversationHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: request.userMessage,
    });

    return messages;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────

export function getDialogueService(): IDialogueService {
  if (isLiveMode()) {
    return new OpenAIDialogueService();
  }
  return new StubDialogueService();
}
