"use client";

import { useState } from "react";
import {
    Settings,
    AlertCircle,
    Calendar,
    TrendingUp,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    Upload,
    Link,
    ChevronDown,
    Sparkles,
} from "lucide-react";
import { SpreadsheetScheduler } from "./SpreadsheetScheduler";
import { RulesEngineModal } from "./RulesEngineModal";
import { SummaryView } from "./SummaryView";
import { TradingView } from "./TradingView";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Member, TimeSlot, PhaseSettings } from "../../types";

interface DesktopDashboardProps {
    members: any[];
    shifts: any[];
    assignments: any[];
    availabilities: any[];
    currentUser: any;
}

type TabType = "schedule" | "summary" | "trading";

const generateTimeSlots = (
    phaseSettings: PhaseSettings,
    shifts: any[],
    assignments: any[],
    selectedDate: Date
): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const dateStr = selectedDate.toDateString();

    // Generate 15-minute intervals (96 slots per day)
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const isNighttime = hour >= 1 && hour < 7;
            const required = isNighttime
                ? phaseSettings.nighttimeRequirement
                : phaseSettings.daytimeRequirement;

            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;

            // Find assignments for this slot
            // 1. Find shifts that cover this time on this day
            // We need to match date and time.
            // Simplified logic: Check if a shift exists that covers this specific 15m block.

            const slotStart = new Date(selectedDate);
            slotStart.setHours(hour, minute, 0, 0);

            // Filter shifts active at this slot
            const activeShifts = shifts.filter((s) => {
                const shiftStart = new Date(s.startTime);
                const shiftEnd = new Date(s.endTime);
                return shiftStart <= slotStart && shiftEnd > slotStart;
            });

            // Get user IDs assigned to these shifts
            // This is a simplistic mapping. In reality, assignments link to shifts.
            const assignedUserIds = assignments
                .filter((a) => activeShifts.some((s) => s.id === a.shiftId))
                .map((a) => a.userId);

            // Determine required count from the shift if possible, else fallback to phase settings
            // If multiple shifts overlap (weird), use the max requirement?
            // Ideally, K-ville shifts are non-overlapping for a single tent usually, or represent different roles.
            // For now, if we have a shift, use its requirement.
            const currentShift = activeShifts[0];
            const slotRequired = currentShift
                ? currentShift.requiredCount
                : required;

            slots.push({
                time: timeString,
                hour,
                minute,
                assigned: assignedUserIds,
                availability: [], // TODO: wiring up availability later
                required: slotRequired,
                isNighttime,
            });
        }
    }

    return slots;
};

export function DesktopDashboard({
    members,
    shifts,
    assignments,
    availabilities,
    currentUser,
}: DesktopDashboardProps) {
    const [phaseSettings, setPhaseSettings] = useState<PhaseSettings>({
        currentPhase: "Blue",
        daytimeRequirement: 10,
        nighttimeRequirement: 6,
    });

    // Map DB members to UI structure
    const uiMembers: Member[] = members.map((m) => ({
        id: m.id,
        name: m.fullName || "Unknown",
        avatarColor: "#3B82F6", // TODO: make dynamic or store in DB
        unavailable: availabilities
            .filter((a) => a.userId === m.id && a.status === "unavailable")
            .map((a) => ({
                start: new Date(a.startTime).toISOString(),
                end: new Date(a.endTime).toISOString(),
                reason: a.status, // or add a reason field to DB if needed
            })),
    }));

    const [selectedDate, setSelectedDate] = useState(new Date());

    // Re-generate slots when data or date changes
    const timeSlots = generateTimeSlots(
        phaseSettings,
        shifts,
        assignments,
        selectedDate
    );

    // Derived state for other modals can remain
    const [showRulesModal, setShowRulesModal] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentTab = (searchParams.get("tab") as TabType) || "schedule";

    const handleTabChange = (tab: TabType) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`);
    };

    const [myScheduleOpen, setMyScheduleOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>(
        currentUser.id
    );

    const handlePhaseUpdate = (newSettings: PhaseSettings) => {
        setPhaseSettings(newSettings);
        setShowRulesModal(false);
    };

    const handleToggleAssignment = (memberId: string, slotTime: string) => {
        // TODO: Implement optimistic UI + Server Action to toggle assignment
        alert("Assignment toggling needs server action implementation.");
    };

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Header Stats */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl text-gray-900 dark:text-white mb-2">
                        Schedule Planner
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Current Phase:{" "}
                        <span className="px-3 py-1 bg-[#003087] text-white rounded ml-2">
                            {phaseSettings.currentPhase}
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => setShowRulesModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#00246b] transition-colors">
                    <Settings className="w-5 h-5" />
                    Configure Phase Rules
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 border-b border-border">
                <button
                    onClick={() => handleTabChange("schedule")}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                        currentTab === "schedule"
                            ? "border-[#003087] text-[#003087] dark:text-white bg-blue-50/10 shadow-sm"
                            : "border-transparent text-muted-foreground hover:text-[#003087] hover:border-[#003087]/20 hover:bg-gray-50/50 hover:shadow-sm"
                    }`}>
                    <Calendar className="w-4 h-4" />
                    Schedule
                </button>
                <button
                    onClick={() => handleTabChange("summary")}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                        currentTab === "summary"
                            ? "border-[#003087] text-[#003087] dark:text-white bg-blue-50/10 shadow-sm"
                            : "border-transparent text-muted-foreground hover:text-[#003087] hover:border-[#003087]/20 hover:bg-gray-50/50 hover:shadow-sm"
                    }`}>
                    <TrendingUp className="w-4 h-4" />
                    Summary
                </button>
                <button
                    onClick={() => handleTabChange("trading")}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 ${
                        currentTab === "trading"
                            ? "border-[#003087] text-[#003087] dark:text-white bg-blue-50/10 shadow-sm"
                            : "border-transparent text-muted-foreground hover:text-[#003087] hover:border-[#003087]/20 hover:bg-gray-50/50 hover:shadow-sm"
                    }`}>
                    <RefreshCw className="w-4 h-4" />
                    Shift Trading
                </button>
                <button
                    onClick={() => router.push("/about")}
                    className="flex items-center gap-2 px-4 py-3 border-b-2 border-transparent text-muted-foreground hover:text-[#003087] hover:border-[#003087]/20 hover:bg-gray-50/50 hover:shadow-sm transition-all duration-200">
                    <AlertCircle className="w-4 h-4" />
                    About
                </button>
            </div>

            {/* Schedule Header Actions */}
            {currentTab === "schedule" && (
                <div className="mb-6 flex items-start gap-4">
                    {/* My Schedule Collapsible Section */}
                    <div className="w-3/4 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <button
                            onClick={() => setMyScheduleOpen(!myScheduleOpen)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <span className="font-medium">My Schedule</span>
                            <ChevronDown
                                className={`w-5 h-5 transition-transform ${
                                    myScheduleOpen ? "rotate-180" : ""
                                } text-muted-foreground`}
                            />
                        </button>

                        {myScheduleOpen && (
                            <div className="px-4 pb-4 border-t">
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {/* Upload Calendar */}
                                    <div className="p-4 rounded-lg border bg-muted/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Upload className="w-5 h-5 text-muted-foreground" />
                                            <h4 className="font-medium">
                                                Upload Calendar
                                            </h4>
                                        </div>
                                        <p className="text-sm mb-3 text-muted-foreground">
                                            Import your availability from Google
                                            Calendar, iCal, or other calendar
                                            services.
                                        </p>
                                        <button
                                            className="w-full px-4 py-2 rounded transition-colors bg-primary text-primary-foreground hover:bg-primary/90"
                                            onClick={() => {
                                                // Placeholder for calendar upload functionality
                                                alert(
                                                    "Calendar upload feature coming soon! Connect your Google Calendar, iCal, or upload .ics files."
                                                );
                                            }}>
                                            Connect Calendar
                                        </button>
                                    </div>

                                    {/* Subscribe to Your Calendar */}
                                    <div className="p-4 rounded-lg border bg-muted/20">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Link className="w-5 h-5 text-muted-foreground" />
                                            <h4 className="font-medium">
                                                Subscribe to Your Column
                                            </h4>
                                        </div>
                                        <p className="text-sm mb-3 text-muted-foreground">
                                            Get a calendar subscription link to
                                            sync your assigned shifts with your
                                            calendar app.
                                        </p>
                                        <div className="space-y-2">
                                            <select
                                                value={selectedMember}
                                                onChange={(e) =>
                                                    setSelectedMember(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 rounded border text-sm bg-background border-input">
                                                {uiMembers.map((member) => (
                                                    <option
                                                        key={member.id}
                                                        value={member.id}>
                                                        {member.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                className="w-full px-4 py-2 rounded transition-colors bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                                                onClick={() => {
                                                    const member =
                                                        uiMembers.find(
                                                            (m) =>
                                                                m.id ===
                                                                selectedMember
                                                        );
                                                    const subscriptionUrl = `webcal://kville.duke.edu/calendar/${selectedMember}`;
                                                    navigator.clipboard.writeText(
                                                        subscriptionUrl
                                                    );
                                                    alert(
                                                        `Calendar subscription link copied for ${member?.name}!\n\n${subscriptionUrl}\n\nAdd this to your calendar app to receive automatic updates.`
                                                    );
                                                }}>
                                                Copy Subscription Link
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate Schedule Button */}
                    <button
                        onClick={() =>
                            alert("Generate Schedule feature coming soon!")
                        }
                        className="w-1/4 bg-[#003087] text-white rounded-lg font-medium hover:bg-[#00246b] transition-colors flex items-center justify-center gap-2 shadow-sm text-center px-4 py-3 h-[50px] border border-transparent">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Schedule</span>
                    </button>
                </div>
            )}

            {/* Tab Content */}
            {currentTab === "schedule" && (
                <SpreadsheetScheduler
                    timeSlots={timeSlots}
                    members={uiMembers}
                    onToggleAssignment={handleToggleAssignment}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            )}

            {currentTab === "summary" && (
                <SummaryView
                    timeSlots={timeSlots}
                    members={uiMembers}
                    currentMemberId={selectedMember}
                    phaseSettings={phaseSettings}
                />
            )}

            {currentTab === "trading" && (
                <TradingView
                    currentUserId={selectedMember}
                    availableShifts={shifts.filter((s) => {
                        // Check if current selected member is assigned to this shift
                        // This is a rough check. Ideally use the assignments array properly.
                        // memberId -> assignment -> shiftId
                        const memberAssignments = assignments.filter(
                            (a) => a.userId === selectedMember
                        );
                        return memberAssignments.some(
                            (a) => a.shiftId === s.id
                        );
                    })}
                />
            )}

            {/* Rules Engine Modal */}
            {showRulesModal && (
                <RulesEngineModal
                    currentSettings={phaseSettings}
                    onSave={handlePhaseUpdate}
                    onClose={() => setShowRulesModal(false)}
                />
            )}
        </div>
    );
}
