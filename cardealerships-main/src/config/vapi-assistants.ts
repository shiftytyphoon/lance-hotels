// Vapi Assistant Configurations
// These configs can be used to create/update assistants via the Vapi API

import type { AgentType } from "@/shared/types";

export interface VapiAssistantConfig {
  id?: string;
  name: string;
  voice: {
    model: string;
    voiceId: string;
    provider: string;
  };
  model: {
    model: string;
    toolIds: string[];
    messages: Array<{
      role: string;
      content: string;
    }>;
    provider: string;
    temperature: number;
  };
  forwardingPhoneNumber?: string;
  firstMessage: string;
  voicemailMessage?: string;
  endCallMessage?: string;
  transcriber: {
    model: string;
    language: string;
    provider: string;
    endpointing?: number;
  };
  clientMessages: string[];
  serverMessages: string[];
  endCallPhrases?: string[];
  hipaaEnabled?: boolean;
  backgroundSound?: string;
  analysisPlan?: {
    summaryPlan?: {
      enabled: boolean;
      messages: Array<{ content: string; role: string }>;
    };
    structuredDataPlan?: {
      schema: Record<string, unknown>;
      messages: Array<{ content: string; role: string }>;
    };
    successEvaluationPlan?: {
      enabled: boolean;
      messages: Array<{ content: string; role: string }>;
    };
  };
  backgroundDenoisingEnabled?: boolean;
  artifactPlan?: {
    recordingEnabled: boolean;
    scorecardIds?: string[];
  };
  startSpeakingPlan?: {
    waitSeconds: number;
    smartEndpointingEnabled?: string;
  };
  compliancePlan?: {
    hipaaEnabled: boolean;
    pciEnabled: boolean;
  };
}

// Service Agent Configuration
export const serviceAgentConfig: VapiAssistantConfig = {
  id: "732ba29e-4aeb-48ad-bd47-440d3fce8b26",
  name: "Car Dealership",
  voice: {
    model: "sonic-3",
    voiceId: "57dcab65-68ac-45a6-8480-6c4c52ec1cd1",
    provider: "cartesia",
  },
  model: {
    model: "gpt-4o",
    toolIds: [
      "003ffe02-36da-429a-8a93-76e49a13359c",
      "ed4c3a26-f85f-48e8-92df-64e997f349ae",
      "b90a838f-5676-4d2b-8893-70daf96fedf4",
      "1555cbff-d2ad-4883-ac06-2447ad557b9f",
    ],
    messages: [
      {
        role: "system",
        content: `You are the adaptive Service Agent for a car dealership's service department.
Your job is to answer calls, understand what the caller needs, and help them book a service appointment or get quick support.
Speak naturally, clearly, and like a real human. Keep responses short and helpful.

## 1. Core Goals
- Greet the caller warmly.
- Understand their service need quickly.
- Collect only the necessary details.
- Book a service appointment when appropriate.
- Provide simple information about service, hours, or availability.
- Transfer to a human advisor when needed.

## 2. What You Handle
You can handle calls about:
- Booking service appointments
- Rescheduling or canceling appointments
- Asking about service availability or hours
- Basic pricing questions (oil change, brakes, tires)
- Caller wants a service advisor or repair status update

If the caller needs something you cannot answer, transfer them to a human advisor.

## 3. Appointment Booking Flow
If the caller wants to schedule:
1. Ask for their name.
2. Ask what car they are bringing in (year, make, model).
3. Ask what service they need.
4. Ask for their preferred day or time.

Keep questions simple and conversational.
Confirm all details before booking.

## 4. TOOL USAGE
You have access to the following tools. Only use a tool when needed.

### **google_calendar_check_availability_tool**
Use this to check available appointment times.
Use it when the caller asks "Do you have availability?" or gives a specific preferred time.

### **google_calendar_tool**
Use this to create or modify service appointments.
Use it after collecting:
- name
- vehicle info
- service needed
- desired time

### **transfer_call_tool**
Use this when:
- The caller asks for a specific person.
- The caller wants a service advisor.
- The caller wants a repair status update.
- The request is too complex or account-specific.

Before transferring, say:
"Sure, I can connect you to a service advisor. One moment."

### **send_text_tool**
Use this only when the caller explicitly asks for service info, appointment details, or directions to be texted.

Example:
"Can you text me the appointment details?"

## 5. Tone and Style
- Warm, calm, and confident.
- Short sentences.
- Never robotic.
- Adjust to the caller's urgency or frustration.

If the caller is upset:
"I understand. Let me help you with that."

## 6. Don'ts
- Do not mention internal tools, systems, or anything about being an AI.
- Do not guess answers.
- Do not ask unnecessary questions.
- Do not talk about sales or inventory. You are service only.

Your goal is to make the service department feel fast, friendly, and reliable.`,
      },
    ],
    provider: "openai",
    temperature: 0.5,
  },
  forwardingPhoneNumber: "+19497218023",
  firstMessage: "Hi there, how can I help you with your service today?",
  voicemailMessage:
    "Hello, this is Riley from Wellness Partners. I'm calling about your appointment. Please call us back at your earliest convenience so we can confirm your scheduling details.",
  endCallMessage:
    "Thank you for scheduling with Wellness Partners. Your appointment is confirmed, and we look forward to seeing you soon. Have a wonderful day!",
  transcriber: {
    model: "nova-3",
    language: "en",
    provider: "deepgram",
    endpointing: 150,
  },
  clientMessages: [
    "conversation-update",
    "function-call",
    "hang",
    "model-output",
    "speech-update",
    "status-update",
    "transfer-update",
    "transcript",
    "tool-calls",
    "user-interrupted",
    "voice-input",
    "workflow.node.started",
    "assistant.started",
  ],
  serverMessages: [
    "conversation-update",
    "end-of-call-report",
    "function-call",
    "hang",
    "speech-update",
    "status-update",
    "tool-calls",
    "transfer-destination-request",
    "handoff-destination-request",
    "user-interrupted",
    "assistant.started",
  ],
  endCallPhrases: ["goodbye", "talk to you soon"],
  hipaaEnabled: false,
  backgroundSound: "office",
  analysisPlan: {
    summaryPlan: {
      enabled: true,
      messages: [
        {
          role: "system",
          content: `You are an expert note-taker for a car dealership's service department.
You will be given a transcript of a service-related phone call.

Summarize the call in 2–3 sentences capturing:
- the caller's name (if provided)
- their vehicle (if mentioned)
- what they needed (service, status update, scheduling, question)
- what the agent did (booked appointment, answered question, transferred, etc.)
- the final outcome of the call.

Keep the summary short, factual, and easy to read.
Do not include filler words or speculation.`,
        },
        {
          role: "user",
          content:
            "Here is the transcript:\n\n{{transcript}}\n\n. Here is the ended reason of the call:\n\n{{endedReason}}\n\n",
        },
      ],
    },
    structuredDataPlan: {
      schema: {
        type: "object",
        properties: {
          caller_name: { type: "string" },
          vehicle_make: { type: "string" },
          vehicle_year: { type: "string" },
          final_outcome: {
            type: "string",
            enum: [
              "appointment_booked",
              "transferred_to_human",
              "info_provided",
              "call_ended_no_resolution",
            ],
          },
          vehicle_model: { type: "string" },
          service_request: { type: "string" },
          appointment_time: { type: "string" },
          transfer_requested: { type: "boolean" },
          appointment_requested: { type: "boolean" },
        },
      },
      messages: [
        {
          role: "system",
          content: `You will be given a transcript of a service-related phone call for a car dealership.
Extract structured data based only on what is explicitly stated in the transcript.
If a field is not mentioned, return null for that field.

Extract the following:

1. caller_name
3. vehicle_year
4. vehicle_make
5. vehicle_model
6. service_request (the reason for the call)
7. appointment_requested (true/false)
8. appointment_time (if given)
9. transfer_requested (true/false)
10. final_outcome
    - "appointment_booked"
    - "transferred_to_human"
    - "info_provided"
    - "call_ended_no_resolution"
    - or null

Return your answer as a JSON object that matches the schema.
Keep descriptions short and factual.
Do not infer or guess missing details.


Json Schema:
{{schema}}

Only respond with the JSON.`,
        },
        {
          role: "user",
          content:
            "Here is the transcript:\n\n{{transcript}}\n\n. Here is the ended reason of the call:\n\n{{endedReason}}\n\n",
        },
      ],
    },
    successEvaluationPlan: {
      enabled: true,
      messages: [
        {
          role: "system",
          content: `You are an expert evaluator for car dealership service calls.
You will be given the system prompt and the full transcript of the call.

Determine whether the call was successful based on the goals of a service agent.

A call is considered SUCCESSFUL if:
- the agent understood the caller's service need, AND
- the agent provided a clear next step (booking an appointment, giving information, confirming availability, or transferring to the right person), AND
- the caller's request was handled without confusion.

A call is considered UNSUCCESSFUL if:
- the agent failed to understand the caller's request,
- the caller's need was not resolved,
- the agent gave incorrect or irrelevant information,
- the caller hung up without a clear outcome,
- the agent behaved in a way that created confusion or frustration.

Your output must be ONLY one word:
"success"
or
"failure"


Rubric:

{{rubric}}

Only respond with the evaluation result.`,
        },
        {
          role: "user",
          content:
            "Here is the transcript of the call:\n\n{{transcript}}\n\n. Here is the ended reason of the call:\n\n{{endedReason}}\n\n",
        },
        {
          role: "user",
          content:
            "Here was the system prompt of the call:\n\n{{systemPrompt}}\n\n",
        },
      ],
    },
  },
  backgroundDenoisingEnabled: false,
  artifactPlan: {
    recordingEnabled: false,
    scorecardIds: ["b2f7f1b3-6102-49b2-914b-bdec402edb72"],
  },
  startSpeakingPlan: {
    waitSeconds: 0.4,
    smartEndpointingEnabled: "livekit",
  },
  compliancePlan: {
    hipaaEnabled: false,
    pciEnabled: false,
  },
};

// Map agent types to their configs
export const agentConfigs: Record<AgentType, VapiAssistantConfig | null> = {
  service: serviceAgentConfig,
  reception: null, // TODO: Add reception agent config
  sales: null, // TODO: Add sales agent config
};

// Helper to get config by agent type
export function getAgentConfig(type: AgentType): VapiAssistantConfig | null {
  return agentConfigs[type] ?? null;
}
