// Agent configuration form
// TODO: Implement agent settings form

import type { AgentConfig, UpdateAgentInput } from "@/shared/types";

interface AgentFormProps {
  agent: AgentConfig;
  onSubmit: (data: UpdateAgentInput) => Promise<void>;
}

export function AgentForm({ agent, onSubmit }: AgentFormProps) {
  // TODO: Implement form with:
  // - Enabled toggle
  // - Tone / persona inputs
  // - Knowledge base references
  // - Tool call toggles (transfer, CRM)
  return (
    <form>
      <h2>{agent.type} Agent Configuration</h2>
      {/* Form fields */}
    </form>
  );
}
