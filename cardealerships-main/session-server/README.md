# Lance Session Server

WebSocket server that bridges Twilio Media Streams with VAPI AI agents.

## Architecture

```
Twilio Call → Lambda (TwiML) → Session Server → VAPI Assistant → Audio Response → Twilio
```

## Endpoints

- `GET /` - Health check (returns status)
- `GET /health` - ALB health check
- `WS /twilio` - WebSocket endpoint for Twilio Media Streams

## Environment Variables

Required:
- `VAPI_API_KEY` - Your VAPI API key
- `VAPI_ASSISTANT_ID` - VAPI assistant ID (defaults to service agent: `732ba29e-4aeb-48ad-bd47-440d3fce8b26`)

Optional:
- `PORT` - Server port (default: 8080)

## Running Locally

```bash
cd session-server
npm install

# Set environment variables
export VAPI_API_KEY=your_vapi_key_here
export VAPI_ASSISTANT_ID=732ba29e-4aeb-48ad-bd47-440d3fce8b26

npm start
```

Server will run on port 8080.

## Docker

```bash
docker build -t lance-session-server .
docker run -p 8080:8080 \
  -e VAPI_API_KEY=your_key \
  -e VAPI_ASSISTANT_ID=your_assistant_id \
  lance-session-server
```

## Deployment

This service is designed to run on AWS ECS with:
- Application Load Balancer health checks on `/health`
- WebSocket connection at `wss://session.lance.live/twilio`
- Environment variables injected via ECS task definition

## How It Works

1. Twilio connects via WebSocket with audio stream
2. Session server establishes connection to VAPI
3. Audio flows bidirectionally:
   - Twilio → Session Server → VAPI (caller audio)
   - VAPI → Session Server → Twilio (AI response audio)
4. VAPI assistant (configured in `src/config/vapi-assistants.ts`) handles the conversation
5. When call ends, both connections close

## VAPI Integration

The session server uses your VAPI assistant configuration defined in:
- `src/config/vapi-assistants.ts` - Service agent prompts, voice, tools
- Assistant ID: `732ba29e-4aeb-48ad-bd47-440d3fce8b26`

The assistant handles:
- Service appointment booking
- Calendar availability checks
- Call transfers to human advisors
- SMS confirmations
