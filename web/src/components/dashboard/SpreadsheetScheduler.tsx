import { useState, useRef } from "react";
import {
    Clock,
    Users,
    CheckCircle,
    HelpCircle,
    X,
    ChevronLeft,
    ChevronRight,
    Calendar,
} from "lucide-react";
import type { Member, TimeSlot, AvailabilityStatus } from "../../types";

interface SpreadsheetSchedulerProps {
    timeSlots: TimeSlot[];
    members: Member[];
    onToggleAssignment: (memberId: string, slotTime: string) => void;
    darkMode: boolean;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

export function SpreadsheetScheduler({
    timeSlots,
    members,
    onToggleAssignment,
    darkMode,
    selectedDate,
    onDateChange,
}: SpreadsheetSchedulerProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [cellAvailability, setCellAvailability] = useState<
        Record<string, AvailabilityStatus>
    >({});
    const [paintMode, setPaintMode] = useState<AvailabilityStatus>("available");
    const dragStartRef = useRef<{ memberId: string; slotTime: string } | null>(
        null
    );

    // Duke Brand Colors - Updated with Green for Available
    const COLORS = {
        available: "#10B981", // Emerald Green
        maybe: "#FFD960", // Dandelion Yellow
        unavailable: "#666666", // Graphite Grey (default)
    };

    const getCellKey = (memberId: string, slotTime: string) =>
        `${memberId}-${slotTime}`;

    const getCellStatus = (
        memberId: string,
        slot: TimeSlot
    ): AvailabilityStatus => {
        const cellKey = getCellKey(memberId, slot.time);

        // Check stored availability first
        if (cellAvailability[cellKey]) {
            return cellAvailability[cellKey];
        }

        // Default to unavailable (grey)
        return "unavailable";
    };

    const handleMouseDown = (memberId: string, slotTime: string) => {
        const slot = timeSlots.find((s) => s.time === slotTime);
        if (!slot) return;

        setIsDragging(true);
        dragStartRef.current = { memberId, slotTime };

        const cellKey = getCellKey(memberId, slotTime);
        setCellAvailability((prev) => ({
            ...prev,
            [cellKey]: paintMode,
        }));
    };

    const handleMouseEnter = (memberId: string, slotTime: string) => {
        if (!isDragging || !dragStartRef.current) return;

        const cellKey = getCellKey(memberId, slotTime);
        setCellAvailability((prev) => ({
            ...prev,
            [cellKey]: paintMode,
        }));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        dragStartRef.current = null;
    };

    const formatTime = (time: string) => {
        const [hourStr, minuteStr] = time.split(":");
        const hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        // Only show hour markers (on the :00)
        if (minute !== 0) return "";

        if (hour === 0) return "12 AM";
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return "12 PM";
        return `${hour - 12} PM`;
    };

    const getRowStaffingStatus = (slot: TimeSlot) => {
        const ratio = slot.assigned.length / slot.required;
        if (ratio < 1) return "understaffed";
        if (ratio === 1) return "perfect";
        return "overstaffed";
    };

    // Group slots to only show hour labels
    const shouldShowTimeLabel = (slot: TimeSlot) => slot.minute === 0;

    return (
        <div
            className={`${
                darkMode ? "bg-gray-900" : "bg-white"
            } rounded-lg border ${
                darkMode ? "border-gray-700" : "border-gray-200"
            }`}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}>
            {/* Header */}
            <div
                className={`flex items-center justify-between p-4 border-b ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                }`}>
                <div className="flex items-center gap-4">
                    <h3
                        className={`text-lg ${
                            darkMode ? "text-white" : "text-gray-900"
                        }`}>
                        Schedule Grid
                    </h3>
                    {/* Compact Day Selector */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                onDateChange(
                                    new Date(
                                        selectedDate.getFullYear(),
                                        selectedDate.getMonth(),
                                        selectedDate.getDate() - 1
                                    )
                                )
                            }
                            className={`p-1 rounded transition-colors ${
                                darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                            }`}>
                            <ChevronLeft
                                className={`w-4 h-4 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                            />
                        </button>
                        <div className="flex items-center gap-1.5">
                            <Calendar
                                className={`w-3.5 h-3.5 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                            />
                            <span
                                className={`text-sm ${
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                }`}>
                                {selectedDate.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })}
                            </span>
                        </div>
                        <button
                            onClick={() =>
                                onDateChange(
                                    new Date(
                                        selectedDate.getFullYear(),
                                        selectedDate.getMonth(),
                                        selectedDate.getDate() + 1
                                    )
                                )
                            }
                            className={`p-1 rounded transition-colors ${
                                darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-100"
                            }`}>
                            <ChevronRight
                                className={`w-4 h-4 ${
                                    darkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                            />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className={`text-xs ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                        } mr-1`}>
                        Paint Mode:
                    </span>
                    <button
                        onClick={() => setPaintMode("available")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                            paintMode === "available"
                                ? "ring-2 ring-emerald-400 ring-offset-2"
                                : "hover:ring-2 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: COLORS.available }}>
                        <CheckCircle className="w-4 h-4 text-white" />
                        <span className="text-xs text-white">Available</span>
                    </button>
                    <button
                        onClick={() => setPaintMode("maybe")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                            paintMode === "maybe"
                                ? "ring-2 ring-yellow-400 ring-offset-2"
                                : "hover:ring-2 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: COLORS.maybe }}>
                        <HelpCircle className="w-4 h-4 text-gray-700" />
                        <span className="text-xs text-gray-700">Maybe</span>
                    </button>
                    <button
                        onClick={() => setPaintMode("unavailable")}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all ${
                            paintMode === "unavailable"
                                ? "ring-2 ring-gray-400 ring-offset-2"
                                : "hover:ring-2 hover:ring-gray-300"
                        }`}
                        style={{ backgroundColor: COLORS.unavailable }}>
                        <X className="w-4 h-4 text-white" />
                        <span className="text-xs text-white">Unavailable</span>
                    </button>
                </div>
            </div>

            {/* Spreadsheet */}
            <div className="overflow-auto max-h-[calc(100vh-300px)]">
                <table className="w-full border-collapse">
                    <thead
                        className={`sticky top-0 ${
                            darkMode ? "bg-gray-800" : "bg-gray-50"
                        } z-10 border-b ${
                            darkMode ? "border-gray-700" : "border-gray-200"
                        }`}>
                        <tr>
                            {/* Time column header */}
                            <th
                                className={`py-2 px-3 text-left border-r ${
                                    darkMode
                                        ? "border-gray-700"
                                        : "border-gray-200"
                                } min-w-[70px] sticky left-0 ${
                                    darkMode ? "bg-gray-800" : "bg-gray-50"
                                } z-20`}>
                                <div className="flex items-center gap-1.5">
                                    <Clock
                                        className={`w-3.5 h-3.5 ${
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs ${
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}>
                                        Time
                                    </span>
                                </div>
                            </th>

                            {/* Member column headers */}
                            {members.map((member) => (
                                <th
                                    key={member.id}
                                    className={`py-2 px-2 border-r ${
                                        darkMode
                                            ? "border-gray-700"
                                            : "border-gray-200"
                                    } min-w-[60px]`}>
                                    <div className="flex flex-col items-center gap-1.5">
                                        <div
                                            className="w-6 h-6 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    member.avatarColor,
                                            }}
                                        />
                                        <span
                                            className={`text-xs ${
                                                darkMode
                                                    ? "text-gray-300"
                                                    : "text-gray-700"
                                            } text-center leading-tight`}>
                                            {member.name.split(" ")[0]}
                                        </span>
                                    </div>
                                </th>
                            ))}

                            {/* Status column header */}
                            <th
                                className={`py-2 px-3 text-center min-w-[90px]`}>
                                <div className="flex items-center justify-center gap-1.5">
                                    <Users
                                        className={`w-3.5 h-3.5 ${
                                            darkMode
                                                ? "text-gray-400"
                                                : "text-gray-500"
                                        }`}
                                    />
                                    <span
                                        className={`text-xs ${
                                            darkMode
                                                ? "text-gray-300"
                                                : "text-gray-600"
                                        }`}>
                                        Staff
                                    </span>
                                </div>
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {timeSlots.map((slot) => {
                            const staffingStatus = getRowStaffingStatus(slot);
                            const showTimeLabel = shouldShowTimeLabel(slot);

                            // Row background based on staffing
                            let rowBgClass = "";
                            if (showTimeLabel) {
                                rowBgClass =
                                    staffingStatus === "understaffed"
                                        ? darkMode
                                            ? "bg-red-950/20"
                                            : "bg-red-50/30"
                                        : staffingStatus === "perfect"
                                        ? darkMode
                                            ? "bg-emerald-950/20"
                                            : "bg-emerald-50/30"
                                        : "";
                            }

                            return (
                                <tr key={slot.time} className={rowBgClass}>
                                    {/* Time cell */}
                                    <td
                                        className={`py-0 px-3 border-r border-b ${
                                            darkMode
                                                ? "border-gray-700"
                                                : "border-gray-200"
                                        } sticky left-0 ${
                                            darkMode
                                                ? "bg-gray-900"
                                                : "bg-white"
                                        } z-10`}>
                                        <div className="flex items-center gap-2 h-6">
                                            {showTimeLabel ? (
                                                <>
                                                    <span
                                                        className={`text-xs ${
                                                            darkMode
                                                                ? "text-gray-300"
                                                                : "text-gray-700"
                                                        }`}>
                                                        {formatTime(slot.time)}
                                                    </span>
                                                    {slot.isNighttime && (
                                                        <span className="text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                                                            Night
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-[10px] text-gray-400">
                                                    :
                                                    {slot.minute
                                                        .toString()
                                                        .padStart(2, "0")}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Member cells */}
                                    {members.map((member) => {
                                        const cellStatus = getCellStatus(
                                            member.id,
                                            slot
                                        );
                                        const cellColor = COLORS[cellStatus];

                                        return (
                                            <td
                                                key={member.id}
                                                className={`p-0.5 border-r border-b ${
                                                    darkMode
                                                        ? "border-gray-700"
                                                        : "border-gray-200"
                                                }`}>
                                                <div
                                                    className="h-6 rounded cursor-pointer transition-all hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 flex items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            cellColor,
                                                    }}
                                                    onMouseDown={() =>
                                                        handleMouseDown(
                                                            member.id,
                                                            slot.time
                                                        )
                                                    }
                                                    onMouseEnter={() =>
                                                        handleMouseEnter(
                                                            member.id,
                                                            slot.time
                                                        )
                                                    }>
                                                    {cellStatus ===
                                                        "available" && (
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    )}
                                                    {cellStatus === "maybe" && (
                                                        <HelpCircle className="w-3 h-3 text-gray-700" />
                                                    )}
                                                    {cellStatus ===
                                                        "unavailable" && (
                                                        <X className="w-2.5 h-2.5 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}

                                    {/* Status cell - full color box with number */}
                                    <td
                                        className={`p-0.5 border-b ${
                                            darkMode
                                                ? "border-gray-700"
                                                : "border-gray-200"
                                        }`}>
                                        <div
                                            className={`h-6 rounded flex items-center justify-center ${
                                                staffingStatus ===
                                                "understaffed"
                                                    ? "bg-red-500"
                                                    : staffingStatus ===
                                                      "perfect"
                                                    ? "bg-emerald-500"
                                                    : "bg-blue-500"
                                            }`}>
                                            <span className="text-white text-sm">
                                                {slot.assigned.length}/
                                                {slot.required}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Instructions */}
            <div
                className={`p-3 border-t ${
                    darkMode
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-200 bg-gray-50"
                }`}>
                <p
                    className={`text-xs ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                    💡 Select a color from the legend above, then click or drag
                    across cells to paint your availability.
                </p>
            </div>
        </div>
    );
}
