/**
 * VAD Service (Voice Activity Detection)
 *
 * Detects when user starts/stops speaking for barge-in handling.
 * Uses Silero VAD (ONNX) or stub mode.
 */

import type { IVADService, VADResult } from './types';
import { isLiveMode } from './config';

// ─────────────────────────────────────────────────────────────────────
// Stub Implementation
// ─────────────────────────────────────────────────────────────────────

class StubVADService implements IVADService {
  private frameCount = 0;

  async load(): Promise<void> {
    console.log('[VAD:Stub] Loaded');
  }

  async process(audioChunk: Buffer | Uint8Array): Promise<VADResult> {
    this.frameCount++;

    // Simulate speech detection every 10 frames
    const speaking = this.frameCount % 10 < 5;

    return {
      speaking,
      confidence: speaking ? 0.9 : 0.1,
      timestamp: new Date(),
    };
  }
}

// ─────────────────────────────────────────────────────────────────────
// Silero ONNX Implementation
// ─────────────────────────────────────────────────────────────────────

class SileroVADService implements IVADService {
  private session: any = null; // TODO: Type with onnxruntime-node
  private threshold = 0.5;

  async load(): Promise<void> {
    // TODO: Load Silero VAD ONNX model
    // const ort = await import('onnxruntime-node');
    // this.session = await ort.InferenceSession.create('./public/models/silero_vad.onnx');
    console.log('[VAD:Silero] TODO: Load ONNX model');
    throw new Error('Silero VAD not yet implemented - download model and install onnxruntime-node');
  }

  async process(audioChunk: Buffer | Uint8Array): Promise<VADResult> {
    if (!this.session) {
      throw new Error('VAD not loaded - call load() first');
    }

    // TODO: Convert audio to tensor and run inference
    // const tensor = new ort.Tensor('float32', float32Audio, [1, audioChunk.length]);
    // const output = await this.session.run({ input: tensor });
    // const confidence = output.output.data[0];

    throw new Error('Silero VAD process not yet implemented');
  }
}

// ─────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────

export function getVADService(): IVADService {
  if (isLiveMode()) {
    return new SileroVADService();
  }
  return new StubVADService();
}
