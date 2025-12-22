// Vapi SDK client wrapper

import type { VapiAssistantConfig } from "@/config/vapi-assistants";

const VAPI_API_KEY = process.env.VAPI_API_KEY!;
const VAPI_BASE_URL = "https://api.vapi.ai";

interface VapiAssistant {
  id: string;
  orgId: string;
  name: string;
  voice: {
    model: string;
    voiceId: string;
    provider: string;
  };
  model: {
    model: string;
    toolIds: string[];
    messages: Array<{ role: string; content: string }>;
    provider: string;
    temperature: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface VapiPhoneNumber {
  id: string;
  phoneNumber: string;
  // TODO: Add full phone number type definition
}

// Create a new Vapi assistant
export async function createAssistant(
  config: Omit<VapiAssistantConfig, "id">
): Promise<VapiAssistant> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error(`Failed to create assistant: ${response.statusText}`);
  }
  return response.json();
}

// Update an existing Vapi assistant
export async function updateAssistant(
  assistantId: string,
  config: Partial<VapiAssistantConfig>
): Promise<VapiAssistant> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(config),
  });
  if (!response.ok) {
    throw new Error(`Failed to update assistant: ${response.statusText}`);
  }
  return response.json();
}

// Get a Vapi assistant by ID
export async function getAssistant(assistantId: string): Promise<VapiAssistant> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant/${assistantId}`, {
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to get assistant: ${response.statusText}`);
  }
  return response.json();
}

// List all assistants
export async function listAssistants(): Promise<VapiAssistant[]> {
  const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to list assistants: ${response.statusText}`);
  }
  return response.json();
}

// Sync assistant config - creates if doesn't exist, updates if it does
export async function syncAssistant(
  config: VapiAssistantConfig
): Promise<VapiAssistant> {
  if (config.id) {
    // Try to update existing
    try {
      return await updateAssistant(config.id, config);
    } catch {
      // If update fails, create new
      const { id, ...configWithoutId } = config;
      return await createAssistant(configWithoutId);
    }
  }
  // No ID, create new
  return await createAssistant(config);
}

export async function listPhoneNumbers(): Promise<VapiPhoneNumber[]> {
  // TODO: List phone numbers from Vapi
  const response = await fetch(`${VAPI_BASE_URL}/phone-number`, {
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
    },
  });
  return response.json();
}

export async function transferCall(
  callId: string,
  destination: string
): Promise<void> {
  // TODO: Transfer an active call
  await fetch(`${VAPI_BASE_URL}/call/${callId}/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${VAPI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destination }),
  });
}
