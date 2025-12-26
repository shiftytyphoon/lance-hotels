'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Live Voice Test Component
 *
 * Tests the full voice pipeline:
 * Browser microphone → WebSocket → Deepgram ASR → GPT Intent/Tone → GPT Dialogue → Text response
 *
 * Features:
 * - Real-time audio capture from microphone
 * - Live transcript display (interim + final)
 * - Intent/tone classification display
 * - Generated response display
 * - Connection status monitoring
 */

interface TranscriptMessage {
  type: 'transcript';
  text: string;
  is_final: boolean;
  confidence: number;
  timestamp: string;
}

interface ClassificationMessage {
  type: 'classification';
  intent: string;
  entities: Record<string, any>;
  emotion: string;
  sentiment: string;
  urgency: number;
  politeness: number;
  confidence: number;
  timestamp: string;
}

interface ResponseMessage {
  type: 'response';
  text: string;
  latency_ms: number;
  model: string;
  timestamp: string;
}

interface AudioChunkMessage {
  type: 'audio_chunk';
  data: string; // Base64 encoded audio data
  format: string;
  sample_rate: number;
  timestamp: string;
}

interface ErrorMessage {
  type: 'error';
  message: string;
  timestamp: string;
}

type WebSocketMessage = TranscriptMessage | ClassificationMessage | ResponseMessage | AudioChunkMessage | ErrorMessage | { type: string; [key: string]: any };

export default function LiveVoiceTest() {
  const [isRecording, setIsRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [classification, setClassification] = useState<ClassificationMessage | null>(null);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [conversationLog, setConversationLog] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioPlaybackContextRef = useRef<AudioContext | null>(null);
  const audioBufferQueueRef = useRef<AudioBuffer[]>([]);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Audio playback functions
  const initAudioPlayback = useCallback(() => {
    if (!audioPlaybackContextRef.current) {
      audioPlaybackContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
  }, []);

  const playAudioChunk = useCallback(async (audioData: Uint8Array, sampleRate: number) => {
    initAudioPlayback();
    const playbackContext = audioPlaybackContextRef.current!;

    // Convert PCM 16-bit to AudioBuffer
    const audioBuffer = playbackContext.createBuffer(1, audioData.length / 2, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // Convert Int16 to Float32
    const dataView = new DataView(audioData.buffer);
    for (let i = 0; i < audioData.length / 2; i++) {
      const int16 = dataView.getInt16(i * 2, true); // little-endian
      channelData[i] = int16 / (int16 < 0 ? 32768 : 32767);
    }

    // Play the audio
    const source = playbackContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(playbackContext.destination);

    currentSourceRef.current = source;
    setIsPlayingAudio(true);

    source.onended = () => {
      setIsPlayingAudio(false);
      currentSourceRef.current = null;
    };

    source.start();
  }, [initAudioPlayback]);

  const stopAudioPlayback = useCallback(() => {
    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
      currentSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  }, []);

  const connectWebSocket = useCallback(() => {
    setConnectionStatus('connecting');
    setError('');

    // Connect to WebSocket (use ws:// in dev, wss:// in production)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/voice/ws`;

    console.log('[LiveVoiceTest] Connecting to:', wsUrl);

    const ws = new WebSocket(wsUrl);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      console.log('[LiveVoiceTest] WebSocket connected');
      setConnectionStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);

        console.log('[LiveVoiceTest] Message:', message);

        switch (message.type) {
          case 'connected':
            console.log('[LiveVoiceTest] Server confirmed connection');
            break;

          case 'transcript':
            if (message.is_final) {
              setFinalTranscript(message.text);
              setInterimTranscript('');
            } else {
              setInterimTranscript(message.text);
            }
            break;

          case 'classification':
            setClassification(message as ClassificationMessage);
            break;

          case 'response':
            setResponse(message.text);
            // Add to conversation log
            setConversationLog(prev => [
              ...prev,
              { role: 'user', text: finalTranscript },
              { role: 'assistant', text: message.text },
            ]);
            break;

          case 'audio_chunk':
            // Decode base64 audio data and play
            try {
              const audioMsg = message as AudioChunkMessage;
              const audioData = Uint8Array.from(atob(audioMsg.data), c => c.charCodeAt(0));
              playAudioChunk(audioData, audioMsg.sample_rate);
            } catch (err) {
              console.error('[LiveVoiceTest] Failed to play audio chunk:', err);
            }
            break;

          case 'error':
            setError(message.message);
            setConnectionStatus('error');
            break;
        }
      } catch (err) {
        console.error('[LiveVoiceTest] Failed to parse message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('[LiveVoiceTest] WebSocket error:', err);
      setConnectionStatus('error');
      setError('WebSocket connection error');
    };

    ws.onclose = () => {
      console.log('[LiveVoiceTest] WebSocket closed');
      setConnectionStatus('disconnected');
      wsRef.current = null;
    };

    wsRef.current = ws;
  }, [finalTranscript, playAudioChunk]);

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      mediaStreamRef.current = stream;

      // Create audio context
      const audioContext = new AudioContext({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);

      // Create processor for audio chunks
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
          return;
        }

        // Get audio data
        const inputData = e.inputBuffer.getChannelData(0);

        // Convert Float32 to Int16 (PCM 16-bit)
        const int16Data = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Send to WebSocket as ArrayBuffer
        wsRef.current.send(int16Data.buffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
      console.log('[LiveVoiceTest] Recording started');

      // Connect WebSocket if not already connected
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        connectWebSocket();
      }

    } catch (err: any) {
      console.error('[LiveVoiceTest] Failed to start recording:', err);
      setError(`Microphone error: ${err.message}`);
    }
  }, [connectWebSocket]);

  const stopRecording = useCallback(() => {
    // Stop audio processing
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Stop media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
    console.log('[LiveVoiceTest] Recording stopped');
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopAudioPlayback();
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (audioPlaybackContextRef.current) {
        audioPlaybackContextRef.current.close();
      }
    };
  }, [stopRecording, stopAudioPlayback]);

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Live Voice Test (Deepgram ASR)</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' :
            connectionStatus === 'error' ? 'bg-red-500' :
            'bg-gray-300'
          }`} />
          <span className="text-sm text-gray-600">{connectionStatus}</span>
        </div>
      </div>

      {/* Recording Control */}
      <div className="flex gap-4">
        <button
          onClick={toggleRecording}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
        </button>

        {isRecording && (
          <div className="flex items-center gap-2 text-red-500 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            Recording...
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Live Transcript */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Live Transcript</h3>
        <div className="p-4 bg-gray-50 border rounded-lg min-h-[80px]">
          {interimTranscript && (
            <p className="text-gray-500 italic">{interimTranscript}</p>
          )}
          {finalTranscript && (
            <p className="text-black font-medium">{finalTranscript}</p>
          )}
          {!interimTranscript && !finalTranscript && (
            <p className="text-gray-400">Waiting for speech...</p>
          )}
        </div>
      </div>

      {/* Classification */}
      {classification && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Classification</h3>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><strong>Intent:</strong> {classification.intent}</div>
              <div><strong>Emotion:</strong> {classification.emotion}</div>
              <div><strong>Sentiment:</strong> {classification.sentiment}</div>
              <div><strong>Urgency:</strong> {(classification.urgency * 100).toFixed(0)}%</div>
              <div><strong>Politeness:</strong> {(classification.politeness * 100).toFixed(0)}%</div>
              <div><strong>Confidence:</strong> {(classification.confidence * 100).toFixed(0)}%</div>
            </div>
            {Object.keys(classification.entities).length > 0 && (
              <div className="mt-2">
                <strong>Entities:</strong>
                <pre className="text-xs mt-1 p-2 bg-white rounded">
                  {JSON.stringify(classification.entities, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Assistant Response</h3>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-900">{response}</p>
            {isPlayingAudio && (
              <div className="flex items-center gap-2 mt-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Playing audio...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conversation Log */}
      {conversationLog.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Conversation History</h3>
          <div className="p-4 bg-gray-50 border rounded-lg max-h-64 overflow-y-auto space-y-2">
            {conversationLog.map((msg, idx) => (
              <div key={idx} className={`p-2 rounded ${
                msg.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'
              }`}>
                <strong>{msg.role === 'user' ? 'You:' : 'Assistant:'}</strong> {msg.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click "Start Recording" to begin</li>
          <li>Speak into your microphone</li>
          <li>Watch live transcript appear</li>
          <li>See intent/tone classification</li>
          <li>View generated response</li>
        </ol>
      </div>
    </div>
  );
}
