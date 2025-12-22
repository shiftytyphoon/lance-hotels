// Agent types and configurations

export type AgentType = "reception" | "service" | "sales";

export interface AgentConfig {
  id: string;
  dealershipId: string;
  type: AgentType;
  vapiAgentId: string | null;
  isEnabled: boolean;
  transferEnabled: boolean;
  transferPhoneNumber: string | null;
  toolCallsEnabled: boolean;
  configJson: AgentPersonaConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AgentPersonaConfig {
  persona: string;
  tone: string;
  greeting: string;
  systemPrompt: string;
  knowledgeBaseIds: string[];
  // Add more persona configuration fields as needed
}

export interface AgentToolCall {
  name: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface CreateAgentInput {
  type: AgentType;
  isEnabled?: boolean;
  transferEnabled?: boolean;
  transferPhoneNumber?: string;
  toolCallsEnabled?: boolean;
  configJson?: Partial<AgentPersonaConfig>;
}

export interface UpdateAgentInput {
  isEnabled?: boolean;
  transferEnabled?: boolean;
  transferPhoneNumber?: string;
  toolCallsEnabled?: boolean;
  configJson?: Partial<AgentPersonaConfig>;
}
