// CDK CRM integration form
// TODO: Implement CDK connection form

import type { ConnectCdkInput, IntegrationStatusResponse } from "@/shared/types";

interface IntegrationCdkFormProps {
  status: IntegrationStatusResponse | null;
  onConnect: (data: ConnectCdkInput) => Promise<void>;
  onDisconnect: () => Promise<void>;
}

export function IntegrationCdkForm({
  status,
  onConnect,
  onDisconnect,
}: IntegrationCdkFormProps) {
  // TODO: Implement form with:
  // - Connection status display
  // - API key input
  // - Dealer code input
  // - Connect/Disconnect buttons
  return (
    <form>
      <h2>CDK CRM Integration</h2>
      {/* Form fields */}
    </form>
  );
}
