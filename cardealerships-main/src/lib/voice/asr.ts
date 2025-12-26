/**
 * ASR Service (Automatic Speech Recognition)
 *
 * Provides speech-to-text transcription via Deepgram or stub mode.
 *
 * Usage:
 *   const asr = getASRService();
 *   await asr.connect(conversationId);
 *   asr.onTranscript((transcript) => console.log(transcript.text));
 *   asr.sendAudio(audioChunk);
 */

import type { IASRService, ASRTranscript } from './types';
import { isLiveMode, voiceConfig } from './config';

// ─────────────────────────────────────────────────────────────────────
// Stub Implementation (No External API)
// ─────────────────────────────────────────────────────────────────────

class StubASRService implements IASRService {
  private transcriptCallback: ((transcript: ASRTranscript) => void) | null = null;
  private audioBuffer: number = 0;
  private fakeTranscripts = [
    "Hello, I'm interested in booking a room.",
    "Do you have availability for next weekend?",
    "I'd like a room with two queen beds please.",
    "What amenities do you offer?",
    "Great, I'll take it. Thank you!",
  ];
  private transcriptIndex = 0;

  async connect(conversationId: string): Promise<void> {
    console.log(`[ASR:Stub] Connected for conversation: ${conversationId}`);
  }

  sendAudio(audioChunk: Buffer | Uint8Array): void {
    this.audioBuffer += audioChunk.length;

    // Simulate transcription every ~3 seconds of audio (48kHz * 2 bytes * 3s)
    const TRIGGER_THRESHOLD = 48000 * 2 * 3;

    if (this.audioBuffer > TRIGGER_THRESHOLD && this.transcriptCallback) {
      const fakeText = this.fakeTranscripts[this.transcriptIndex % this.fakeTranscripts.length];
      this.transcriptIndex++;

      // Simulate interim result first
      setTimeout(() => {
        this.transcriptCallback?.({
          text: fakeText.substring(0, fakeText.length / 2) + '...',
          is_final: false,
          confidence: 0.85,
          timestamp: new Date(),
        });
      }, 50);

      // Then final result
      setTimeout(() => {
        this.transcriptCallback?.({
          text: fakeText,
          is_final: true,
          confidence: 0.95,
          timestamp: new Date(),
        });
      }, 100);

      this.audioBuffer = 0;
    }
  }

  onTranscript(callback: (transcript: ASRTranscript) => void): void {
    this.transcriptCallback = callback;
  }

  disconnect(): void {
    console.log('[ASR:Stub] Disconnected');
    this.transcriptCallback = null;
  }
}

// ─────────────────────────────────────────────────────────────────────
// Live Implementation (Deepgram)
// ─────────────────────────────────────────────────────────────────────

class DeepgramASRService implements IASRService {
  private connection: any = null;
  private transcriptCallback: ((transcript: ASRTranscript) => void) | null = null;

  async connect(conversationId: string): Promise<void> {
    console.log(`[ASR:Deepgram] Connecting for conversation: ${conversationId}`);

    // Dynamic import to avoid edge runtime issues
    const { createClient, LiveTranscriptionEvents } = await import('@deepgram/sdk');
    const deepgram = createClient(voiceConfig.getApiKey('deepgram')!);

    // Create live transcription connection
    this.connection = deepgram.listen.live({
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
      interim_results: true,
      endpointing: 300, // ms of silence before finalizing
      utterance_end_ms: 1000, // End utterance after 1s of silence
    });

    // Handle transcript events
    this.connection.on(LiveTranscriptionEvents.Transcript, (data: any) => {
      const transcript = data.channel?.alternatives?.[0]?.transcript;

      if (transcript && transcript.trim().length > 0 && this.transcriptCallback) {
        this.transcriptCallback({
          text: transcript,
          is_final: data.is_final || false,
          confidence: data.channel?.alternatives?.[0]?.confidence || 0.0,
          timestamp: new Date(),
        });

        console.log(`[ASR:Deepgram] ${data.is_final ? 'FINAL' : 'interim'}: "${transcript}"`);
      }
    });

    // Handle errors
    this.connection.on(LiveTranscriptionEvents.Error, (error: any) => {
      console.error('[ASR:Deepgram] Error:', error);
    });

    // Handle connection open
    this.connection.on(LiveTranscriptionEvents.Open, () => {
      console.log('[ASR:Deepgram] Connection opened');
    });

    // Handle connection close
    this.connection.on(LiveTranscriptionEvents.Close, () => {
      console.log('[ASR:Deepgram] Connection closed');
    });

    console.log('[ASR:Deepgram] Connected successfully');
  }

  sendAudio(audioChunk: Buffer | Uint8Array): void {
    if (!this.connection) {
      throw new Error('Not connected - call connect() first');
    }

    // Send audio data to Deepgram
    this.connection.send(audioChunk);
  }

  onTranscript(callback: (transcript: ASRTranscript) => void): void {
    this.transcriptCallback = callback;
  }

  disconnect(): void {
    console.log('[ASR:Deepgram] Disconnecting...');

    if (this.connection) {
      this.connection.finish();
      this.connection = null;
    }

    this.transcriptCallback = null;
    console.log('[ASR:Deepgram] Disconnected');
  }
}

// ─────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────

export function getASRService(): IASRService {
  if (isLiveMode()) {
    return new DeepgramASRService();
  }
  return new StubASRService();
}
