type AgentType = "reception" | "service" | "sales";

interface AgentConfigPageProps {
  params: Promise<{
    agentType: AgentType;
  }>;
}

export default async function AgentConfigPage({ params }: AgentConfigPageProps) {
  const { agentType } = await params;

  // TODO: Per-agent configuration
  // - Enabled toggle
  // - Tone / persona inputs
  // - Knowledge base references (uses dealership info)
  // - Tool call toggles:
  //   - "Transfer to human" and phone number
  //   - "Use CDK CRM" and linked integration
  return (
    <main>
      <h1>{agentType.charAt(0).toUpperCase() + agentType.slice(1)} Agent Configuration</h1>
      {/* Agent configuration form */}
    </main>
  );
}
