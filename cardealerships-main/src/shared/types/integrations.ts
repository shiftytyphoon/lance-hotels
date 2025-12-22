// Integration types (CDK CRM, etc.)

export type IntegrationProvider = "cdk";

export type IntegrationStatus = "connected" | "disconnected" | "error";

export interface Integration {
  id: string;
  dealershipId: string;
  provider: IntegrationProvider;
  status: IntegrationStatus;
  configJson: IntegrationConfig;
  createdAt: string;
  updatedAt: string;
}

export type IntegrationConfig = CdkIntegrationConfig;

export interface CdkIntegrationConfig {
  apiKey: string;
  dealerCode: string;
  endpoint?: string;
  // Add more CDK-specific fields as needed
}

export interface ConnectCdkInput {
  apiKey: string;
  dealerCode: string;
  endpoint?: string;
}

export interface IntegrationStatusResponse {
  provider: IntegrationProvider;
  status: IntegrationStatus;
  lastSync?: string;
  error?: string;
}
