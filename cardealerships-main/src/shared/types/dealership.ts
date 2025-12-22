// Dealership types

export interface Dealership {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealershipMember {
  id: string;
  userId: string;
  dealershipId: string;
  role: DealershipRole;
  createdAt: string;
}

export type DealershipRole = "admin" | "staff";

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
}

export interface CreateDealershipInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  timezone: string;
}

export interface UpdateDealershipInput {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  timezone?: string;
}
