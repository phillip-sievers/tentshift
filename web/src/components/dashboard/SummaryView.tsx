import { useState, useEffect } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    Clock,
    Users,
    Calendar,
    ChevronRight,
} from "lucide-react";
import type { Member, TimeSlot, PhaseSettings } from "../../types";

interface SummaryViewProps {
    timeSlots: TimeSlot[];
    members: Member[];
    currentMemberId: string;
    phaseSettings: PhaseSettings;
}

export function SummaryView({
    timeSlots,
    members,
    currentMemberId,
    phaseSettings,
}: SummaryViewProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // 1. Determine Current Slot based on Real Time ( HH:MM )
    const getCurrentSlotIndex = () => {
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        // Convert to logic index (each hour has 4 slots of 15 mins)
        // e.g., 00:00 -> index 0, 00:15 -> index 1
        return currentHour * 4 + Math.floor(currentMinute / 15);
    };

    const currentSlotIndex = getCurrentSlotIndex();
    const currentSlot = timeSlots[currentSlotIndex] || timeSlots[0];
    const nextSlot = timeSlots[currentSlotIndex + 1] || timeSlots[0];

    // 2. Helpers
    const getMemberDetails = (ids: string[]) =>
        ids
            .map((id) => members.find((m) => m.id === id))
            .filter((m): m is Member => !!m);

    const currentShiftMembers = getMemberDetails(currentSlot.assigned);
    const nextShiftMembers = getMemberDetails(nextSlot.assigned);

    const isSafe = currentSlot.assigned.length >= currentSlot.required;

    // 3. Find Next Personal Shift
    // Look from current index onwards
    const nextPersonalSlot = timeSlots
        .slice(currentSlotIndex)
        .find((slot) => slot.assigned.includes(currentMemberId));

    const nextPersonalShiftDisplay = nextPersonalSlot
        ? `Today at ${formatTimeDisplay(
              nextPersonalSlot.hour,
              nextPersonalSlot.minute
          )}`
        : "No more shifts today";

    function formatTimeDisplay(hour: number, minute: number) {
        return new Date(0, 0, 0, hour, minute).toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        });
    }

    const currentMember = members.find((m) => m.id === currentMemberId);

    // Dynamic Colors based on State
    const statusColor = isSafe
        ? "bg-duke-navy text-white"
        : "bg-amber-500 text-white";
    const statusIcon = isSafe ? (
        <ShieldCheck className="w-12 h-12" />
    ) : (
        <AlertTriangle className="w-12 h-12" />
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HERRO SECTION - Real Time Status */}
            <div
                className={`rounded-2xl shadow-xl overflow-hidden relative ${statusColor} transition-colors duration-500`}>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
                <div className="relative p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-white/20 rounded-full backdrop-blur-md shadow-inner">
                        {statusIcon}
                    </div>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
                            {isSafe ? "TENT IS SAFE" : "NEEDS COVERAGE"}
                        </h2>
                        <p className="text-lg md:text-xl font-medium opacity-90">
                            {currentSlot.assigned.length} /{" "}
                            {currentSlot.required} Tenters Present
                        </p>
                    </div>

                    <div className="flex items-center gap-6 mt-4 text-sm font-semibold tracking-wide uppercase opacity-80">
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {currentTime.toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                            })}
                        </span>
                        <span className="w-1 h-1 bg-current rounded-full" />
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {phaseSettings.currentPhase} Phase
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Who is on Shift NOW */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            On Shift Now
                        </h3>
                    </div>

                    <div className="flex-1 space-y-4">
                        {currentShiftMembers.length > 0 ? (
                            currentShiftMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm"
                                        style={{
                                            backgroundColor: member.avatarColor,
                                        }}>
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {member.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            until{" "}
                                            {formatTimeDisplay(
                                                nextSlot.hour,
                                                nextSlot.minute
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 py-8">
                                <Users className="w-8 h-8 opacity-50" />
                                <p>No one checked in</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. UP NEXT */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col opacity-90">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            Coming Up Next
                            <span className="ml-2 text-sm font-normal text-slate-500">
                                {formatTimeDisplay(
                                    nextSlot.hour,
                                    nextSlot.minute
                                )}
                            </span>
                        </h3>
                    </div>

                    <div className="flex-1 space-y-4">
                        {nextShiftMembers.length > 0 ? (
                            nextShiftMembers.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-sm opacity-80"
                                        style={{
                                            backgroundColor: member.avatarColor,
                                        }}>
                                        {member.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                        {member.name}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">
                                No assignments yet
                            </p>
                        )}
                    </div>
                </div>

                {/* 3. MY INFO */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/20"
                                style={{
                                    backgroundColor:
                                        currentMember?.avatarColor || "#999",
                                }}>
                                {currentMember?.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">
                                    Hello, {currentMember?.name.split(" ")[0]}
                                </h3>
                                <p className="text-slate-400 text-sm">
                                    Member Status: Active
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/5">
                                <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">
                                    Your Next Shift
                                </p>
                                <div className="text-xl font-semibold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-amber-400" />
                                    {nextPersonalShiftDisplay}
                                </div>
                            </div>
                        </div>
                    </div>

                    <button className="mt-8 w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg">
                        View Full Schedule
                    </button>
                </div>
            </div>
        </div>
    );
}
