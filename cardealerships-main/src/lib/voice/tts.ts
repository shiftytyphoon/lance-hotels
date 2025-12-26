/**
 * TTS Service (Text-to-Speech)
 *
 * Synthesizes speech from text using Cartesia Sonic or stub mode.
 */

import type { ITTSService, TTSRequest, TTSResponse, AudioChunk } from './types';
import { isLiveMode, voiceConfig } from './config';

// ─────────────────────────────────────────────────────────────────────
// Stub Implementation
// ─────────────────────────────────────────────────────────────────────

class StubTTSService implements ITTSService {
  async synthesize(request: TTSRequest): Promise<TTSResponse> {
    console.log(`[TTS:Stub] Synthesizing: "${request.text.substring(0, 50)}..."`);

    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 80));

    // Return fake audio chunks
    async function* generateFakeAudio(): AsyncGenerator<AudioChunk> {
      const chunkCount = Math.ceil(request.text.length / 20);

      for (let i = 0; i < chunkCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));

        yield {
          id: `chunk-${i}`,
          data: new Uint8Array(4800), // Fake audio data
          format: 'pcm16',
          sample_rate: 24000,
          channels: 1,
          timestamp: new Date(),
          flushed: false,
        };
      }
    }

    return {
      audio_chunks: generateFakeAudio(),
      latency_ms: 80,
    };
  }

  async synthesizeStreaming(
    request: TTSRequest,
    onChunk: (chunk: AudioChunk) => void
  ): Promise<{ latency_ms: number }> {
    const response = await this.synthesize(request);

    for await (const chunk of response.audio_chunks) {
      onChunk(chunk);
    }

    return { latency_ms: response.latency_ms };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Cartesia Implementation
// ─────────────────────────────────────────────────────────────────────

class CartesiaTTSService implements ITTSService {
  async synthesize(request: TTSRequest): Promise<TTSResponse> {
    console.log(`[TTS:Cartesia] Synthesizing: "${request.text.substring(0, 50)}..."`);

    // For Cartesia, we need to use the streaming approach directly
    // So we'll delegate to synthesizeStreaming and collect chunks
    const chunks: AudioChunk[] = [];
    const startTime = Date.now();

    await this.synthesizeStreaming(request, (chunk) => {
      chunks.push(chunk);
    });

    // Convert collected chunks into async generator
    async function* generateChunks(): AsyncGenerator<AudioChunk> {
      for (const chunk of chunks) {
        yield chunk;
      }
    }

    return {
      audio_chunks: generateChunks(),
      latency_ms: Date.now() - startTime,
    };
  }

  async synthesizeStreaming(
    request: TTSRequest,
    onChunk: (chunk: AudioChunk) => void
  ): Promise<{ latency_ms: number }> {
    const startTime = Date.now();

    console.log(`[TTS:Cartesia] Streaming synthesis: "${request.text.substring(0, 50)}..."`);

    // Dynamic import to avoid edge runtime issues
    const { CartesiaClient } = await import('@cartesia/cartesia-js');
    const cartesia = new CartesiaClient({
      apiKey: voiceConfig.getApiKey('cartesia')!,
    });

    // Get voice ID from config or request
    const voiceId = request.voice_id || voiceConfig.getVoiceId();

    // Create WebSocket connection for streaming
    const ws = await cartesia.tts.websocket({
      container: 'raw' as const,
      encoding: 'pcm_s16le' as const,
      sampleRate: 24000,
    });

    try {
      let chunkIndex = 0;

      // Send text for synthesis
      const response = await ws.send({
        modelId: 'sonic-english',
        voice: {
          mode: 'id' as const,
          id: voiceId,
        },
        transcript: request.text,
        // Add prosody hints if specified
        ...(request.prosody_hints?.speed && {
          language: 'en',
          duration: 1.0 / request.prosody_hints.speed,
        }),
      });

      // Stream audio chunks as they arrive
      let lastChunkTime = Date.now();
      const checkInterval = setInterval(() => {
        // If no chunks received for 500ms, assume done
        if (Date.now() - lastChunkTime > 500) {
          clearInterval(checkInterval);
        }
      }, 100);

      await new Promise<void>((resolve, reject) => {
        let messageCount = 0;

        response.on('message', (message: any) => {
          if (message.data) {
            messageCount++;
            lastChunkTime = Date.now();

            // Audio chunk received - convert ArrayBuffer to Uint8Array
            const audioData = new Uint8Array(message.data);

            onChunk({
              id: `cartesia-chunk-${chunkIndex++}`,
              data: audioData,
              format: 'pcm16',
              sample_rate: 24000,
              channels: 1,
              timestamp: new Date(),
              flushed: false,
            });
          } else if (message.done || message.type === 'done') {
            // Done message received
            console.log('[TTS:Cartesia] Synthesis complete');
            clearInterval(checkInterval);
            resolve();
          }
        });

        // Set a timeout to prevent hanging
        setTimeout(() => {
          clearInterval(checkInterval);
          if (messageCount > 0) {
            console.log('[TTS:Cartesia] Stream completed (timeout)');
            resolve();
          } else {
            reject(new Error('TTS timeout - no audio received'));
          }
        }, 30000); // 30 second max timeout
      });
    } finally {
      ws.disconnect();
    }

    const latency = Date.now() - startTime;
    console.log(`[TTS:Cartesia] Total latency: ${latency}ms`);

    return { latency_ms: latency };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────

export function getTTSService(): ITTSService {
  if (isLiveMode()) {
    return new CartesiaTTSService();
  }
  return new StubTTSService();
}
