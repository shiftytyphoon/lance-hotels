/**
 * Voice Stack - Main Entry Point
 *
 * Exports all voice services and utilities.
 *
 * Usage:
 *   import { getASRService, getIntentToneService, isStubMode } from '@/lib/voice';
 */

// Config
export { voiceConfig, isStubMode, isLiveMode, getVoiceConfig } from './config';

// Types
export * from './types';

// Services
export { getASRService } from './asr';
export { getIntentToneService } from './intent-tone';
export { getDialogueService } from './dialogue';
export { getTTSService } from './tts';
export { getVADService } from './vad';
