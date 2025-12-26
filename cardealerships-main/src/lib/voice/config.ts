/**
 * Voice Stack Configuration
 *
 * Reads environment variables and provides type-safe configuration
 * Handles missing API keys gracefully (stub mode)
 */

import type { VoiceConfig, VoiceStackMode, LLMProvider } from './types';

class VoiceConfigManager {
  private config: VoiceConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validate();
  }

  private loadConfig(): VoiceConfig {
    const mode = (process.env.VOICE_STACK_MODE || 'stub') as VoiceStackMode;
    const llmProvider = (process.env.LLM_PROVIDER || 'openai') as LLMProvider;

    return {
      mode,
      llmProvider,
      enableSupabaseLogging: process.env.ENABLE_SUPABASE_LOGGING === 'true',
      enableProsodyTuning: process.env.ENABLE_PROSODY_TUNING !== 'false', // Default true
      enableBackchanneling: process.env.ENABLE_BACKCHANNELING === 'true',
      enableSpeculativeTTS: process.env.ENABLE_SPECULATIVE_TTS === 'true',
    };
  }

  private validate() {
    if (this.config.mode === 'live') {
      this.validateLiveMode();
    } else {
      console.log('[VoiceConfig] Running in STUB mode - using mocked responses');
    }
  }

  private validateLiveMode() {
    const missing: string[] = [];

    // Check required API keys
    if (!process.env.DEEPGRAM_API_KEY) {
      missing.push('DEEPGRAM_API_KEY');
    }

    if (!process.env.CARTESIA_API_KEY) {
      missing.push('CARTESIA_API_KEY');
    }

    if (!process.env.CARTESIA_DEFAULT_VOICE_ID) {
      missing.push('CARTESIA_DEFAULT_VOICE_ID');
    }

    // Check LLM provider key
    if (this.config.llmProvider === 'openai' && !process.env.OPENAI_API_KEY) {
      missing.push('OPENAI_API_KEY');
    }

    if (this.config.llmProvider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
      missing.push('ANTHROPIC_API_KEY');
    }

    if (missing.length > 0) {
      const error = `
╔════════════════════════════════════════════════════════════════╗
║  VOICE STACK: Missing API Keys for Live Mode                  ║
╚════════════════════════════════════════════════════════════════╝

You have VOICE_STACK_MODE=live but the following environment
variables are missing:

${missing.map(key => `  ❌ ${key}`).join('\n')}

Options:
1. Add the missing API keys to .env.local
2. Switch to stub mode: VOICE_STACK_MODE=stub
3. See docs/setup-guide.md for detailed instructions

Current mode will default to STUB for safety.
      `.trim();

      console.error(error);

      // Downgrade to stub mode for safety
      this.config.mode = 'stub';
    } else {
      console.log('[VoiceConfig] ✅ Live mode validated - all API keys present');
    }
  }

  public get(): VoiceConfig {
    return { ...this.config };
  }

  public isStubMode(): boolean {
    return this.config.mode === 'stub';
  }

  public isLiveMode(): boolean {
    return this.config.mode === 'live';
  }

  public getApiKey(service: 'deepgram' | 'cartesia' | 'openai' | 'anthropic'): string | undefined {
    const envMap = {
      deepgram: 'DEEPGRAM_API_KEY',
      cartesia: 'CARTESIA_API_KEY',
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
    };

    return process.env[envMap[service]];
  }

  public getVoiceId(): string {
    return process.env.CARTESIA_DEFAULT_VOICE_ID || 'stub-voice-id';
  }

  public getLLMProvider(): LLMProvider {
    return this.config.llmProvider;
  }
}

// Export singleton instance
export const voiceConfig = new VoiceConfigManager();

// Export convenience functions
export function isStubMode(): boolean {
  return voiceConfig.isStubMode();
}

export function isLiveMode(): boolean {
  return voiceConfig.isLiveMode();
}

export function getVoiceConfig(): VoiceConfig {
  return voiceConfig.get();
}
