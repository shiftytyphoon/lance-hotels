// Telephony configuration form
// TODO: Implement telephony settings form

import type { TelephonyConfig } from "@/shared/types";

interface TelephonyFormProps {
  config: TelephonyConfig;
  onSubmit: (data: Partial<TelephonyConfig>) => Promise<void>;
}

export function TelephonyForm({ config, onSubmit }: TelephonyFormProps) {
  // TODO: Implement form with:
  // - Primary phone number
  // - SIP configuration
  // - Transfer numbers
  return (
    <form>
      <h2>Telephony Configuration</h2>
      {/* Form fields */}
    </form>
  );
}
