// Telephony configuration types

export interface TelephonyNumber {
  id: string;
  dealershipId: string;
  phoneNumber: string;
  vapiPhoneId: string | null;
  sipDomain: string | null;
  sipUsername: string | null;
  sipPasswordEncrypted: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TelephonyConfig {
  primaryNumber: TelephonyNumber | null;
  additionalNumbers: TelephonyNumber[];
  transferNumbers: TransferNumber[];
}

export interface TransferNumber {
  id: string;
  label: string;
  phoneNumber: string;
  department: string;
}

export interface SipConfig {
  domain: string;
  username: string;
  password: string;
}

export interface CreateTelephonyNumberInput {
  phoneNumber: string;
  isPrimary?: boolean;
  sipDomain?: string;
  sipUsername?: string;
  sipPassword?: string;
}

export interface UpdateTelephonyNumberInput {
  isPrimary?: boolean;
  sipDomain?: string;
  sipUsername?: string;
  sipPassword?: string;
}
