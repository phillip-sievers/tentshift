export type Phase = 'Black' | 'Blue' | 'White';

export type AvailabilityStatus = 'available' | 'maybe' | 'unavailable';

export interface MemberAvailability {
  memberId: string;
  slotTime: string;
  status: AvailabilityStatus;
}

export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  unavailable?: { start: string; end: string; reason: string }[];
}

export interface TimeSlot {
  time: string;
  hour: number;
  minute: number;
  assigned: string[];
  availability: MemberAvailability[];
  required: number;
  isNighttime: boolean;
}

export interface Shift {
  id: string;
  date: string;
  time: string;
  assignedTo: string;
  tradedBy?: string;
  isAvailable: boolean;
}

export interface PhaseSettings {
  currentPhase: Phase;
  daytimeRequirement: number;
  nighttimeRequirement: number;
}