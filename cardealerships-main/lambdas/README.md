# Lance Lambdas

AWS Lambda functions for the Lance voice agent platform.

## Structure

### twilio-voice-webhook
Handles incoming Twilio voice calls and returns TwiML to open a Media Stream.

- **Trigger**: API Gateway POST from Twilio
- **Returns**: TwiML XML that connects to `wss://session.lance.live/twilio`
- **No validation yet** - keep it simple

### tool-router
Placeholder Lambda for routing tool calls from VAPI/AI agents.

- **Status**: Stub implementation only
- **Returns**: JSON confirmation that it received the request
- **Integration**: Not built yet

## Deployment

Each Lambda should be deployed separately via:
- AWS Console
- Terraform/CDK
- SAM CLI

Each folder has its own `package.json` for dependencies.

## Notes

- Use Node 20.x runtime
- Set appropriate memory/timeout for each function
- No Twilio signature validation yet - add later
