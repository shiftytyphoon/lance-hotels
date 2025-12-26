'use client';

import { useState } from 'react';
import {
  getIntentToneService,
  getDialogueService,
  isStubMode,
  type IntentType,
  type ToneEmotion,
} from '@/lib/voice';

/**
 * Stub Mode Demo Component
 *
 * Shows that the voice stack works without any API keys.
 * Demonstrates intent/tone classification and dialogue generation.
 */

export function StubModeDemo() {
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    intent: IntentType;
    intentConfidence: number;
    emotion: ToneEmotion;
    urgency: number;
    response: string;
    latency: {
      intent: number;
      dialogue: number;
      total: number;
    };
  } | null>(null);

  const testPipeline = async () => {
    if (!userInput.trim()) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      // Step 1: Classify intent and tone
      const classifier = getIntentToneService();
      const classification = await classifier.classify(userInput, []);

      const intentTime = Date.now();

      // Step 2: Generate dialogue
      const dialogue = getDialogueService();
      const dialogueResponse = await dialogue.generate({
        userMessage: userInput,
        intent: {
          ...classification.intent,
          id: 'test-intent',
          utterance_id: 'test-utterance',
          extracted_at: new Date(),
        },
        tone: {
          ...classification.tone,
          id: 'test-tone',
          utterance_id: 'test-utterance',
          detected_at: new Date(),
        },
        hotelContext: {
          name: 'Lance Grand Hotel',
          amenities: ['rooftop pool', 'fitness center', 'spa', 'restaurant'],
          policies: {
            check_in_time: '3:00 PM',
            check_out_time: '11:00 AM',
          },
        },
        conversationHistory: [],
      });

      const endTime = Date.now();

      setResult({
        intent: classification.intent.type,
        intentConfidence: classification.intent.confidence,
        emotion: classification.tone.emotion,
        urgency: classification.tone.urgency_score,
        response: dialogueResponse.text,
        latency: {
          intent: intentTime - startTime,
          dialogue: endTime - intentTime,
          total: endTime - startTime,
        },
      });
    } catch (error) {
      console.error('[StubModeDemo] Error:', error);
      alert('Error processing - check console');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-xl p-6 border border-white/[0.06]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white font-medium">Voice Pipeline Test</h3>
          <p className="text-white/40 text-xs mt-1">
            Running in{' '}
            <span className={isStubMode() ? 'text-emerald-400' : 'text-orange-400'}>
              {isStubMode() ? 'STUB' : 'LIVE'}
            </span>{' '}
            mode
          </p>
        </div>

        {isStubMode() && (
          <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <p className="text-emerald-400 text-xs font-medium">No API keys required</p>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a guest message (e.g., 'I need a room for tonight')"
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-white/[0.16] resize-none"
          rows={2}
        />

        <button
          onClick={testPipeline}
          disabled={isProcessing || !userInput.trim()}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Test Pipeline (Intent → Dialogue)'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* Intent & Tone */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/[0.04] rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Intent</p>
              <p className="text-white text-sm font-medium">{result.intent}</p>
              <p className="text-white/30 text-xs mt-1">{(result.intentConfidence * 100).toFixed(0)}% confidence</p>
            </div>

            <div className="bg-white/[0.04] rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Emotion</p>
              <p className="text-white text-sm font-medium">{result.emotion}</p>
              <p className="text-white/30 text-xs mt-1">Urgency: {(result.urgency * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Response */}
          <div className="bg-white/[0.04] rounded-lg p-4 border border-white/[0.06]">
            <p className="text-white/40 text-xs mb-2">Assistant Response:</p>
            <p className="text-white text-sm leading-relaxed">{result.response}</p>
          </div>

          {/* Latency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/[0.04] rounded-lg p-3 text-center">
              <p className="text-white/40 text-xs mb-1">Intent</p>
              <p className="text-emerald-400 text-lg font-semibold">{result.latency.intent}ms</p>
            </div>

            <div className="bg-white/[0.04] rounded-lg p-3 text-center">
              <p className="text-white/40 text-xs mb-1">Dialogue</p>
              <p className="text-emerald-400 text-lg font-semibold">{result.latency.dialogue}ms</p>
            </div>

            <div className="bg-white/[0.04] rounded-lg p-3 text-center">
              <p className="text-white/40 text-xs mb-1">Total</p>
              <p className="text-orange-400 text-lg font-semibold">{result.latency.total}ms</p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 pt-4 border-t border-white/[0.06]">
        <p className="text-white/40 text-xs">
          <strong className="text-white/60">Try these:</strong> "I need a room" • "What amenities do you have?" • "Book a
          deluxe room for 2 guests"
        </p>
      </div>
    </div>
  );
}
