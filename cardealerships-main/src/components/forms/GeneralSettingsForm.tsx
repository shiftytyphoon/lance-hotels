// General dealership settings form
// TODO: Implement general settings form

import type { Dealership, UpdateDealershipInput } from "@/shared/types";

interface GeneralSettingsFormProps {
  dealership: Dealership;
  onSubmit: (data: UpdateDealershipInput) => Promise<void>;
}

export function GeneralSettingsForm({
  dealership,
  onSubmit,
}: GeneralSettingsFormProps) {
  // TODO: Implement form with:
  // - Dealership name
  // - Address
  // - Hours
  // - Time zone
  return (
    <form>
      <h2>General Settings</h2>
      {/* Form fields */}
    </form>
  );
}
