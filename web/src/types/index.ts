export type Phase = "Black" | "Blue" | "White";

export type AvailabilityStatus = "available" | "maybe" | "unavailable";

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

export type TradeType = "handoff" | "swap";
export type TradeUrgency = "low" | "medium" | "high";
export type TradeStatus = "open" | "pending" | "completed" | "cancelled";

export interface Trade {
    id: string;
    creatorId: string;
    type: TradeType;
    urgency: TradeUrgency;
    status: TradeStatus;
    offeredTimeSlot: {
        start: string; // ISO string
        end: string;
        day: string; // "Monday", "Tuesday" etc for display
    };
    requestedTimeSlot?: {
        start: string;
        end: string;
    };
    note?: string;
    createdAt: string;
}
