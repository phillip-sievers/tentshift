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

interface DesktopDashboardProps {}

type TabType = "schedule" | "summary" | "trading";

const MOCK_MEMBERS: Member[] = [
    {
        id: "1",
        name: "Alex Chen",
        avatarColor: "#3B82F6",
        unavailable: [{ start: "09:00", end: "11:00", reason: "ECON 101" }],
    },
    {
        id: "2",
        name: "Jordan Smith",
        avatarColor: "#8B5CF6",
        unavailable: [
            { start: "14:00", end: "16:00", reason: "Chemistry Lab" },
        ],
    },
    {
        id: "3",
        name: "Sam Taylor",
        avatarColor: "#EC4899",
        unavailable: [{ start: "10:00", end: "12:00", reason: "Math Exam" }],
    },
    { id: "4", name: "Casey Morgan", avatarColor: "#F59E0B", unavailable: [] },
    {
        id: "5",
        name: "Riley Parker",
        avatarColor: "#10B981",
        unavailable: [{ start: "13:00", end: "15:00", reason: "Study Group" }],
    },
    { id: "6", name: "Drew Wilson", avatarColor: "#06B6D4", unavailable: [] },
    {
        id: "7",
        name: "Morgan Lee",
        avatarColor: "#F43F5E",
        unavailable: [{ start: "08:00", end: "10:00", reason: "Bio Lecture" }],
    },
    { id: "8", name: "Jamie Davis", avatarColor: "#6366F1", unavailable: [] },
    {
        id: "9",
        name: "Quinn Brown",
        avatarColor: "#84CC16",
        unavailable: [{ start: "15:00", end: "17:00", reason: "Physics" }],
    },
    { id: "10", name: "Avery Jones", avatarColor: "#F97316", unavailable: [] },
    {
        id: "11",
        name: "Cameron White",
        avatarColor: "#14B8A6",
        unavailable: [],
    },
    {
        id: "12",
        name: "Reese Martin",
        avatarColor: "#A855F7",
        unavailable: [{ start: "11:00", end: "13:00", reason: "English Lit" }],
    },
];

const generateTimeSlots = (phaseSettings: PhaseSettings): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    // Generate 15-minute intervals (96 slots per day)
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const isNighttime = hour >= 1 && hour < 7;
            const required = isNighttime
                ? phaseSettings.nighttimeRequirement
                : phaseSettings.daytimeRequirement;

            slots.push({
                time: `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`,
                hour,
                minute,
                assigned: [],
                availability: [],
                required,
                isNighttime,
            });
        }
    }

    // Add some initial assignments for demo (using new time format)
    slots[36].assigned = ["1", "2", "4", "5", "6", "8", "10", "11"]; // 9:00
    slots[40].assigned = ["1", "3", "5", "7", "9"]; // 10:00
    slots[56].assigned = ["1", "3", "4", "6", "7", "8", "9", "10", "11", "12"]; // 14:00
    slots[80].assigned = ["2", "4", "5", "6", "8", "10"]; // 20:00
    slots[8].assigned = ["7", "9", "11"]; // 2:00

    return slots;
};

export function DesktopDashboard() {
    const [phaseSettings, setPhaseSettings] = useState<PhaseSettings>({
        currentPhase: "Blue",
        daytimeRequirement: 10,
        nighttimeRequirement: 6,
    });
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
        generateTimeSlots(phaseSettings)
    );
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

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [myScheduleOpen, setMyScheduleOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<string>("1"); // Default to first member

    // Format date for display
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    // Navigate to previous day
    const previousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    // Navigate to next day
    const nextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    // Jump to today
    const goToToday = () => {
        setSelectedDate(new Date());
    };

    const handlePhaseUpdate = (newSettings: PhaseSettings) => {
        setPhaseSettings(newSettings);
        setTimeSlots(generateTimeSlots(newSettings));
        setShowRulesModal(false);
    };

    const handleAssignMember = (memberId: string, slotTime: string) => {
        setTimeSlots((prev) =>
            prev.map((slot) =>
                slot.time === slotTime
                    ? {
                          ...slot,
                          assigned: [...new Set([...slot.assigned, memberId])],
                      }
                    : slot
            )
        );
    };

    const handleRemoveMember = (memberId: string, slotTime: string) => {
        setTimeSlots((prev) =>
            prev.map((slot) =>
                slot.time === slotTime
                    ? {
                          ...slot,
                          assigned: slot.assigned.filter(
                              (id) => id !== memberId
                          ),
                      }
                    : slot
            )
        );
    };

    const handleToggleAssignment = (memberId: string, slotTime: string) => {
        setTimeSlots((prev) =>
            prev.map((slot) => {
                if (slot.time === slotTime) {
                    const isAssigned = slot.assigned.includes(memberId);
                    return {
                        ...slot,
                        assigned: isAssigned
                            ? slot.assigned.filter((id) => id !== memberId)
                            : [...slot.assigned, memberId],
                    };
                }
                return slot;
            })
        );
    };

    const getStaffingSummary = () => {
        const understaffed = timeSlots.filter(
            (slot) => slot.assigned.length < slot.required
        ).length;
        const overstaffed = timeSlots.filter(
            (slot) => slot.assigned.length > slot.required
        ).length;
        const perfect = timeSlots.filter(
            (slot) => slot.assigned.length === slot.required
        ).length;

        return { understaffed, overstaffed, perfect };
    };

    const summary = getStaffingSummary();

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
            </div>

            {/* Schedule Header Actions */}
            {currentTab === "schedule" && (
                <div className="mb-6 flex items-start gap-4">
                    {/* My Schedule Collapsible Section - Takes up 75% */}
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
                                                {MOCK_MEMBERS.map((member) => (
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
                                                        MOCK_MEMBERS.find(
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

                    {/* Generate Schedule Button - Takes up 25% */}
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
                    members={MOCK_MEMBERS}
                    onToggleAssignment={handleToggleAssignment}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            )}

            {currentTab === "summary" && (
                <SummaryView
                    timeSlots={timeSlots}
                    members={MOCK_MEMBERS}
                    currentMemberId={selectedMember}
                    phaseSettings={phaseSettings}
                />
            )}

            {currentTab === "trading" && (
                <TradingView currentUserId={selectedMember} />
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
