/**
 * Edge WebSocket Handler for Voice Streaming
 *
 * This is the core orchestration layer for real-time voice:
 * - Accepts WebSocket connections from browser clients
 * - Routes audio to ASR (Deepgram)
 * - Manages conversation state
 * - Streams TTS audio back to client
 *
 * Latency target: <50ms round-trip (echo mode)
 *                 <300ms end-to-end (full pipeline)
 */

import { NextRequest } from 'next/server';

// Force Edge Runtime (supports WebSocket in Vercel)
export const runtime = 'edge';

interface EchoMessage {
  type: 'echo' | 'audio' | 'start' | 'stop';
  timestamp?: number;
  data?: string; // Base64 encoded audio or JSON payload
}

interface EchoResponse {
  type: 'connected' | 'echo' | 'latency';
  clientTime?: number;
  serverTime?: number;
  roundTripMs?: number;
  message?: string;
}

export async function GET(req: NextRequest) {
  // Check for WebSocket upgrade header
  const upgradeHeader = req.headers.get('upgrade');
  if (upgradeHeader !== 'websocket') {
    return new Response('Expected WebSocket upgrade', {
      status: 426,
      headers: { 'Upgrade': 'websocket' }
    });
  }

  // @ts-ignore - Deno WebSocket API (available in Vercel Edge)
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener('open', () => {
    console.log('[WebSocket] Client connected');

    const connectionMsg: EchoResponse = {
      type: 'connected',
      serverTime: Date.now(),
      message: 'WebSocket connection established',
    };

    socket.send(JSON.stringify(connectionMsg));
  });

  socket.addEventListener('message', (event: MessageEvent) => {
    const receivedAt = Date.now();

    try {
      const data: EchoMessage = JSON.parse(event.data);

      switch (data.type) {
        case 'echo':
          // Simple echo for latency testing
          const echoMsg: EchoResponse = {
            type: 'echo',
            clientTime: data.timestamp,
            serverTime: receivedAt,
            roundTripMs: data.timestamp ? receivedAt - data.timestamp : undefined,
          };
          socket.send(JSON.stringify(echoMsg));
          break;

        case 'audio':
          // Echo audio back (for now, later will process through pipeline)
          // This tests audio streaming latency
          socket.send(JSON.stringify({
            type: 'audio',
            data: data.data, // Echo the audio back
            serverTime: receivedAt,
          }));
          break;

        case 'start':
          console.log('[WebSocket] Client started conversation');
          socket.send(JSON.stringify({
            type: 'latency',
            message: 'Conversation started',
            serverTime: receivedAt,
          }));
          break;

        case 'stop':
          console.log('[WebSocket] Client stopped conversation');
          socket.send(JSON.stringify({
            type: 'latency',
            message: 'Conversation stopped',
            serverTime: receivedAt,
          }));
          break;

        default:
          console.warn('[WebSocket] Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('[WebSocket] Message parsing error:', error);
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
      }));
    }
  });

  socket.addEventListener('close', () => {
    console.log('[WebSocket] Client disconnected');
  });

  socket.addEventListener('error', (error: Event) => {
    console.error('[WebSocket] Error:', error);
  });

  return response;
}
