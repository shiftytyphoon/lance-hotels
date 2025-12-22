const express = require('express');
const http = require('http');
const { WebSocketServer, WebSocket } = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || '732ba29e-4aeb-48ad-bd47-440d3fce8b26'; // Default to service agent

// Health check endpoints for ALB
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'lance-session-server',
    time: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// WebSocket server for Twilio Media Streams
const wss = new WebSocketServer({ server, path: '/twilio' });

wss.on('connection', (twilioWs, req) => {
  console.log('Twilio WS connected');

  let streamSid = null;
  let callSid = null;
  let vapiWs = null;

  twilioWs.on('message', async (message) => {
    try {
      const msg = JSON.parse(message);

      if (msg.event === 'start') {
        streamSid = msg.start.streamSid;
        callSid = msg.start.callSid;
        console.log(`Stream started: ${streamSid}, Call: ${callSid}`);

        // Connect to VAPI Web SDK
        if (VAPI_API_KEY) {
          vapiWs = new WebSocket('wss://api.vapi.ai', {
            headers: {
              'Authorization': `Bearer ${VAPI_API_KEY}`
            }
          });

          vapiWs.on('open', () => {
            console.log('Connected to VAPI');
            // Start VAPI call with assistant
            vapiWs.send(JSON.stringify({
              type: 'start',
              assistantId: VAPI_ASSISTANT_ID,
              callSid: callSid
            }));
          });

          vapiWs.on('message', (vapiMessage) => {
            // Forward VAPI audio back to Twilio
            const vapiData = JSON.parse(vapiMessage);
            if (vapiData.type === 'audio' && vapiData.audio) {
              twilioWs.send(JSON.stringify({
                event: 'media',
                streamSid: streamSid,
                media: {
                  payload: vapiData.audio
                }
              }));
            }
          });

          vapiWs.on('error', (error) => {
            console.error('VAPI WebSocket error:', error);
          });
        }
      }

      if (msg.event === 'media' && vapiWs && vapiWs.readyState === WebSocket.OPEN) {
        // Forward Twilio audio to VAPI
        vapiWs.send(JSON.stringify({
          type: 'audio',
          audio: msg.media.payload
        }));
      }

      if (msg.event === 'stop') {
        console.log(`Stream stopped: ${streamSid}`);
        if (vapiWs) {
          vapiWs.close();
        }
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });

  twilioWs.on('close', () => {
    console.log('Twilio WS disconnected');
    if (vapiWs) {
      vapiWs.close();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Session server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/twilio`);
  console.log(`VAPI Assistant ID: ${VAPI_ASSISTANT_ID}`);
});
