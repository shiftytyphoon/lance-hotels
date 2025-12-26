/**
 * WebSocket Voice Pipeline Route
 *
 * Full end-to-end voice pipeline:
 * Browser Mic → WebSocket → Deepgram ASR → GPT Intent/Tone → GPT Dialogue → Cartesia TTS → Browser Speaker
 *
 * NOTE: This route uses Deno.upgradeWebSocket which requires Deno runtime.
 * For Vercel deployment, use alternative deployment options (see WEEK2_DEEPGRAM_ASR_COMPLETE.md)
 */

import { getASRService } from '@/lib/voice/asr';
import { getIntentToneService } from '@/lib/voice/intent-tone';
import { getDialogueService } from '@/lib/voice/dialogue';
import { getTTSService } from '@/lib/voice/tts';
import { voiceConfig } from '@/lib/voice/config';
import type { ConversationMessage } from '@/lib/voice/types';

// Type declaration for Deno global (when available)
declare global {
  var Deno: {
    upgradeWebSocket: (req: Request) => { socket: WebSocket; response: Response };
  } | undefined;
}

export async function GET(request: Request) {
  // Check if Deno WebSocket upgrade is available
  if (typeof globalThis.Deno === 'undefined' || !globalThis.Deno?.upgradeWebSocket) {
    return new Response(
      JSON.stringify({
        error: 'WebSocket upgrade not supported',
        message: 'This route requires Deno runtime. See deployment options in WEEK2_DEEPGRAM_ASR_COMPLETE.md',
      }),
      { status: 501, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const conversationId = crypto.randomUUID();
  const conversationHistory: ConversationMessage[] = [];

  console.log(`[Voice:WS] New connection: ${conversationId}`);

  // Initialize services
  const asr = getASRService();
  const intentTone = getIntentToneService();
  const dialogue = getDialogueService();
  const tts = getTTSService();

  const { socket, response } = globalThis.Deno!.upgradeWebSocket(request);

  socket.onopen = async () => {
    console.log(`[Voice:WS] ${conversationId} - Socket opened`);

    // Connect to ASR service
    await asr.connect(conversationId);

    // Set up ASR transcript callback
    asr.onTranscript(async (transcript) => {
      console.log(`[Voice:WS] ${conversationId} - Transcript: ${transcript.text}`);

      // Send transcript to client
      socket.send(JSON.stringify({
        type: 'transcript',
        text: transcript.text,
        is_final: transcript.is_final,
        confidence: transcript.confidence,
        timestamp: transcript.timestamp.toISOString(),
      }));

      // Only process final transcripts
      if (transcript.is_final && transcript.text.trim().length > 0) {
        try {
          // Step 1: Intent/Tone Classification
          const classification = await intentTone.classify(
            transcript.text,
            conversationHistory
          );

          console.log(`[Voice:WS] ${conversationId} - Intent: ${classification.intent.type}`);

          // Send classification to client
          socket.send(JSON.stringify({
            type: 'classification',
            intent: classification.intent.type,
            entities: classification.intent.entities,
            emotion: classification.tone.emotion,
            sentiment: classification.tone.sentiment,
            urgency: classification.tone.urgency_score,
            politeness: classification.tone.politeness_score,
            confidence: classification.intent.confidence,
            timestamp: new Date().toISOString(),
          }));

          // Step 2: Generate Dialogue Response
          const utteranceId = crypto.randomUUID();
          const dialogueResponse = await dialogue.generate({
            userMessage: transcript.text,
            intent: {
              ...classification.intent,
              id: crypto.randomUUID(),
              utterance_id: utteranceId,
              extracted_at: new Date(),
            },
            tone: {
              ...classification.tone,
              id: crypto.randomUUID(),
              utterance_id: utteranceId,
              detected_at: new Date(),
            },
            hotelContext: {
              name: 'Lance Hotels',
              amenities: ['Pool', 'Gym', 'Free WiFi', 'Parking', 'Restaurant'],
              policies: {
                checkIn: '3:00 PM',
                checkOut: '11:00 AM',
                cancellation: '24 hours before arrival',
              },
            },
            conversationHistory,
          });

          console.log(`[Voice:WS] ${conversationId} - Response: ${dialogueResponse.text.substring(0, 50)}...`);

          // Send text response to client
          socket.send(JSON.stringify({
            type: 'response',
            text: dialogueResponse.text,
            latency_ms: dialogueResponse.latency_ms,
            model: dialogueResponse.model,
            timestamp: new Date().toISOString(),
          }));

          // Update conversation history
          conversationHistory.push(
            { role: 'user', content: transcript.text, timestamp: new Date() },
            { role: 'assistant', content: dialogueResponse.text, timestamp: new Date() }
          );

          // Step 3: Synthesize Speech with TTS
          console.log(`[Voice:WS] ${conversationId} - Generating TTS...`);

          await tts.synthesizeStreaming(
            {
              text: dialogueResponse.text,
              voice_id: voiceConfig.getVoiceId(),
              prosody_hints: {
                emotion: classification.tone.emotion,
                speed: 1.0,
              },
            },
            (chunk) => {
              // Send audio chunks to client
              // Convert Uint8Array to base64 for JSON transmission
              const base64Audio = btoa(String.fromCharCode(...chunk.data));

              socket.send(JSON.stringify({
                type: 'audio_chunk',
                data: base64Audio,
                format: chunk.format,
                sample_rate: chunk.sample_rate,
                timestamp: chunk.timestamp.toISOString(),
              }));
            }
          );

          console.log(`[Voice:WS] ${conversationId} - TTS complete`);

        } catch (error: any) {
          console.error(`[Voice:WS] ${conversationId} - Error:`, error);

          socket.send(JSON.stringify({
            type: 'error',
            message: error.message || 'Internal server error',
            timestamp: new Date().toISOString(),
          }));
        }
      }
    });

    // Send connection confirmation
    socket.send(JSON.stringify({
      type: 'connected',
      conversationId,
      timestamp: new Date().toISOString(),
    }));
  };

  socket.onmessage = (event: MessageEvent) => {
    // Receive audio data from browser
    if (event.data instanceof ArrayBuffer) {
      // Forward audio to ASR service
      asr.sendAudio(new Uint8Array(event.data));
    } else {
      console.warn(`[Voice:WS] ${conversationId} - Unexpected message type:`, typeof event.data);
    }
  };

  socket.onerror = (error: Event) => {
    console.error(`[Voice:WS] ${conversationId} - Socket error:`, error);
  };

  socket.onclose = () => {
    console.log(`[Voice:WS] ${conversationId} - Socket closed`);
    asr.disconnect();
  };

  return response;
}
