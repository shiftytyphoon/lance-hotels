/**
 * Voice Stack Type Definitions
 *
 * Core interfaces for the entire voice pipeline:
 * - Conversation state and metadata
 * - Audio and transcription
 * - Intent and tone classification
 * - LLM decisions and dialogue
 * - TTS synthesis planning
 *
 * These types match the database schema in docs/voice-database-schema.sql
 */

// ─────────────────────────────────────────────────────────────────────
// Configuration & Mode
// ─────────────────────────────────────────────────────────────────────

export type VoiceStackMode = 'stub' | 'live';

export type LLMProvider = 'openai' | 'anthropic';

export interface VoiceConfig {
  mode: VoiceStackMode;
  llmProvider: LLMProvider;
  enableSupabaseLogging: boolean;
  enableProsodyTuning: boolean;
  enableBackchanneling: boolean;
  enableSpeculativeTTS: boolean;
}

// ─────────────────────────────────────────────────────────────────────
// Conversation & Call State
// ─────────────────────────────────────────────────────────────────────

export enum ConversationChannel {
  WEB = 'web',
  PHONE = 'phone',
  DEMO = 'demo',
}

export enum ConversationPhase {
  GREETING = 'greeting',
  LISTENING = 'listening',
  THINKING = 'thinking',
  SPEAKING = 'speaking',
  TRANSFERRING = 'transferring',
  ENDED = 'ended',
}

export interface Conversation {
  id: string;
  hotel_id: string;
  channel: ConversationChannel;
  phase: ConversationPhase;
  started_at: Date;
  ended_at: Date | null;
  duration_seconds: number | null;
  user_phone?: string;
  metadata: {
    twilio_call_sid?: string;
    browser_user_agent?: string;
    ip_address?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Audio & Transcription
// ─────────────────────────────────────────────────────────────────────

export enum UtteranceRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface Utterance {
  id: string;
  conversation_id: string;
  role: UtteranceRole;
  text: string;
  audio_url?: string;
  started_at: Date;
  ended_at: Date;
  duration_ms: number;
  is_final: boolean;
  confidence?: number;
  metadata: {
    asr_model?: string;
    tts_voice_id?: string;
    interrupted?: boolean;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Intent & Tone
// ─────────────────────────────────────────────────────────────────────

export enum IntentType {
  // Booking & Reservations
  BOOK_ROOM = 'book_room',
  MODIFY_RESERVATION = 'modify_reservation',
  CANCEL_RESERVATION = 'cancel_reservation',
  CHECK_AVAILABILITY = 'check_availability',

  // Information Requests
  ASK_AMENITIES = 'ask_amenities',
  ASK_HOURS = 'ask_hours',
  ASK_LOCATION = 'ask_location',
  ASK_PRICING = 'ask_pricing',
  ASK_RECOMMENDATIONS = 'ask_recommendations',

  // Support & Services
  REPORT_ISSUE = 'report_issue',
  REQUEST_SERVICE = 'request_service',
  BILLING_INQUIRY = 'billing_inquiry',
  TRANSFER_TO_HUMAN = 'transfer_to_human',
  META_FEEDBACK = 'meta_feedback',

  // Conversation Flow
  GREETING = 'greeting',
  ACKNOWLEDGMENT = 'acknowledgment',
  FAREWELL = 'farewell',
  UNCLEAR = 'unclear',
}

export interface Intent {
  id: string;
  utterance_id: string;
  type: IntentType;
  confidence: number; // 0-1
  entities: Record<string, any>;
  extracted_at: Date;
  model_used: string;
  latency_ms: number;
}

export enum ToneEmotion {
  NEUTRAL = 'neutral',
  HAPPY = 'happy',
  FRUSTRATED = 'frustrated',
  CONFUSED = 'confused',
  URGENT = 'urgent',
  ANGRY = 'angry',
  GRATEFUL = 'grateful',
  CONCERNED = 'concerned',
}

export enum ToneSentiment {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
}

export interface Tone {
  id: string;
  utterance_id: string;
  emotion: ToneEmotion;
  sentiment: ToneSentiment;
  urgency_score: number; // 0-1
  politeness_score: number; // 0-1
  confidence: number;
  detected_at: Date;
  model_used: string;
  latency_ms: number;
}

// ─────────────────────────────────────────────────────────────────────
// LLM Decision
// ─────────────────────────────────────────────────────────────────────

export interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  result: any;
  executed_at: Date;
}

export interface LLMDecision {
  id: string;
  conversation_id: string;
  utterance_id: string;
  prompt: string;
  response: string;
  model: string;
  temperature: number;
  max_tokens: number;
  stop_sequences?: string[];
  function_calls?: FunctionCall[];
  reasoning?: string;
  created_at: Date;
  latency_ms: number;
  total_tokens: number;
  metadata: {
    stream_latency_p50?: number;
    stream_latency_p99?: number;
  };
}

// ─────────────────────────────────────────────────────────────────────
// TTS Plan
// ─────────────────────────────────────────────────────────────────────

export interface PauseHint {
  after_word: string;
  duration_ms: number;
}

export interface ProsodyHints {
  speed: number; // 0.8-1.2 (1.0 = normal)
  pitch_shift?: number; // -12 to +12 semitones
  emotion?: ToneEmotion;
  emphasis?: string[];
  pauses?: PauseHint[];
}

export interface TTSPlan {
  id: string;
  llm_decision_id: string;
  text: string;
  voice_id: string;
  prosody_hints: ProsodyHints;
  created_at: Date;
  synthesized_at: Date | null;
  audio_url?: string;
  latency_ms?: number;
}

// ─────────────────────────────────────────────────────────────────────
// Real-time State (in-memory, not persisted)
// ─────────────────────────────────────────────────────────────────────

export interface AudioChunk {
  id: string;
  data: Buffer | Uint8Array;
  format: 'pcm16' | 'opus' | 'mp3';
  sample_rate: number;
  channels: number;
  timestamp: Date;
  flushed: boolean;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  intent?: IntentType;
  tone?: ToneEmotion;
  timestamp: Date;
}

export interface ConversationState {
  conversation_id: string;
  phase: ConversationPhase;

  // Audio streams (WebSocket connections)
  asr_connection: any | null; // WebSocket | DeepgramConnection
  tts_connection: any | null; // WebSocket | CartesiaConnection

  // Buffers
  audio_queue: AudioChunk[];
  partial_transcript: string;

  // Barge-in tracking
  user_speaking: boolean;
  assistant_speaking: boolean;
  last_user_speech_at: Date | null;
  last_vad_detection_at: Date | null;

  // Conversation history (for LLM context)
  history: ConversationMessage[];

  // Hotel context
  hotel_id: string;
  hotel_data: {
    name: string;
    amenities: string[];
    policies: Record<string, any>;
  };
}

// ─────────────────────────────────────────────────────────────────────
// Module Interfaces (for dependency injection / stub mode)
// ─────────────────────────────────────────────────────────────────────

/**
 * VAD (Voice Activity Detection)
 */
export interface VADResult {
  speaking: boolean;
  confidence: number;
  timestamp: Date;
}

export interface IVADService {
  process(audioChunk: Buffer | Uint8Array): Promise<VADResult>;
  load(): Promise<void>;
}

/**
 * ASR (Automatic Speech Recognition)
 */
export interface ASRTranscript {
  text: string;
  is_final: boolean;
  confidence: number;
  timestamp: Date;
}

export interface IASRService {
  connect(conversationId: string): Promise<void>;
  sendAudio(audioChunk: Buffer | Uint8Array): void;
  onTranscript(callback: (transcript: ASRTranscript) => void): void;
  disconnect(): void;
}

/**
 * Intent/Tone Classifier
 */
export interface IntentToneResult {
  intent: Omit<Intent, 'id' | 'utterance_id' | 'extracted_at'>;
  tone: Omit<Tone, 'id' | 'utterance_id' | 'detected_at'>;
}

export interface IIntentToneService {
  classify(
    transcript: string,
    conversationHistory: ConversationMessage[]
  ): Promise<IntentToneResult>;
}

/**
 * Dialogue Manager (LLM)
 */
export interface DialogueRequest {
  userMessage: string;
  intent: Intent;
  tone: Tone;
  hotelContext: {
    name: string;
    amenities: string[];
    policies: Record<string, any>;
  };
  conversationHistory: ConversationMessage[];
}

export interface DialogueResponse {
  text: string;
  latency_ms: number;
  total_tokens: number;
  model: string;
  function_calls?: FunctionCall[];
}

export interface IDialogueService {
  generate(request: DialogueRequest): Promise<DialogueResponse>;
  generateStreaming(
    request: DialogueRequest,
    onToken: (token: string) => void
  ): Promise<DialogueResponse>;
}

/**
 * TTS (Text-to-Speech)
 */
export interface TTSRequest {
  text: string;
  voice_id: string;
  prosody_hints: ProsodyHints;
}

export interface TTSResponse {
  audio_chunks: AsyncGenerator<AudioChunk>;
  latency_ms: number;
  audio_url?: string; // If cached/stored
}

export interface ITTSService {
  synthesize(request: TTSRequest): Promise<TTSResponse>;
  synthesizeStreaming(
    request: TTSRequest,
    onChunk: (chunk: AudioChunk) => void
  ): Promise<{ latency_ms: number }>;
}

// ─────────────────────────────────────────────────────────────────────
// Orchestrator
// ─────────────────────────────────────────────────────────────────────

export interface VoiceOrchestrator {
  handleUserAudio(audioChunk: Buffer | Uint8Array): Promise<void>;
  handleTranscript(transcript: ASRTranscript): Promise<void>;
  handleBargeIn(): void;
  getState(): ConversationState;
}
