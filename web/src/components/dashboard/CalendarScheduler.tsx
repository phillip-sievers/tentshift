import { useDrop } from "react-dnd";
import { X, Clock, Users, AlertTriangle } from "lucide-react";
import type { Member, TimeSlot } from "../../types";

interface CalendarSchedulerProps {
    timeSlots: TimeSlot[];
    members: Member[];
    onAssignMember: (memberId: string, slotTime: string) => void;
    onRemoveMember: (memberId: string, slotTime: string) => void;
    darkMode: boolean;
}

interface SlotCardProps {
    slot: TimeSlot;
    members: Member[];
    onAssignMember: (memberId: string) => void;
    onRemoveMember: (memberId: string) => void;
    darkMode: boolean;
}

function SlotCard({
    slot,
    members,
    onAssignMember,
    onRemoveMember,
    darkMode,
}: SlotCardProps) {
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: "MEMBER",
        drop: (item: { id: string; name: string }) => {
            onAssignMember(item.id);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    const staffingRatio = slot.assigned.length / slot.required;
    const isUnderstaffed = staffingRatio < 1;
    const isFullyStaffed = staffingRatio === 1;
    const isOverstaffed = staffingRatio > 1;

    // Determine background color based on staffing
    let bgColor = darkMode ? "bg-gray-800" : "bg-white";
    if (isUnderstaffed) {
        bgColor = darkMode ? "bg-red-950/50" : "bg-red-50";
    } else if (isFullyStaffed) {
        bgColor = darkMode ? "bg-emerald-950/50" : "bg-emerald-50";
    }

    let borderColor = darkMode ? "border-gray-700" : "border-gray-200";
    if (isOver && canDrop) {
        borderColor = "border-[#003087]";
    }

    const assignedMembers = members.filter((m) => slot.assigned.includes(m.id));

    // Check for unavailable members
    const hasConflicts = assignedMembers.some((member) => {
        if (!member.unavailable) return false;
        const slotHour = slot.hour;
        return member.unavailable.some((unavail) => {
            const startHour = parseInt(unavail.start.split(":")[0]);
            const endHour = parseInt(unavail.end.split(":")[0]);
            return slotHour >= startHour && slotHour < endHour;
        });
    });

    const formatTime = (time: string) => {
        const hour = parseInt(time.split(":")[0]);
        if (hour === 0) return "12:00 AM";
        if (hour < 12) return `${hour}:00 AM`;
        if (hour === 12) return "12:00 PM";
        return `${hour - 12}:00 PM`;
    };

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={`${bgColor} ${borderColor} border-2 rounded-lg p-4 transition-all ${
                isOver && canDrop ? "scale-105 shadow-lg" : ""
            } ${slot.isNighttime ? "border-l-4 border-l-purple-500" : ""}`}>
            {/* Time Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-300 dark:border-gray-600">
                <div className="flex items-center gap-2">
                    <Clock
                        className={`w-4 h-4 ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                    />
                    <span className={darkMode ? "text-white" : "text-gray-900"}>
                        {formatTime(slot.time)}
                    </span>
                    {slot.isNighttime && (
                        <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
                            Night
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasConflicts && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    <div
                        className={`flex items-center gap-1 ${
                            isUnderstaffed
                                ? "text-red-600 dark:text-red-400"
                                : isFullyStaffed
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-blue-600 dark:text-blue-400"
                        }`}>
                        <Users className="w-4 h-4" />
                        <span>
                            {slot.assigned.length}/{slot.required}
                        </span>
                    </div>
                </div>
            </div>

            {/* Assigned Members */}
            <div className="space-y-2 min-h-[60px]">
                {assignedMembers.length === 0 ? (
                    <div
                        className={`text-center py-4 text-sm ${
                            darkMode ? "text-gray-500" : "text-gray-400"
                        }`}>
                        Drag members here to assign
                    </div>
                ) : (
                    assignedMembers.map((member) => {
                        const hasConflict = member.unavailable?.some(
                            (unavail) => {
                                const slotHour = slot.hour;
                                const startHour = parseInt(
                                    unavail.start.split(":")[0]
                                );
                                const endHour = parseInt(
                                    unavail.end.split(":")[0]
                                );
                                return (
                                    slotHour >= startHour && slotHour < endHour
                                );
                            }
                        );

                        const conflict = member.unavailable?.find((unavail) => {
                            const slotHour = slot.hour;
                            const startHour = parseInt(
                                unavail.start.split(":")[0]
                            );
                            const endHour = parseInt(unavail.end.split(":")[0]);
                            return slotHour >= startHour && slotHour < endHour;
                        });

                        return (
                            <div
                                key={member.id}
                                className={`flex items-center justify-between p-2 rounded ${
                                    hasConflict
                                        ? "bg-amber-100 dark:bg-amber-900/30 border border-amber-400"
                                        : darkMode
                                        ? "bg-gray-700"
                                        : "bg-gray-100"
                                } group`}>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <div
                                        className="w-6 h-6 rounded-full flex-shrink-0"
                                        style={{
                                            backgroundColor: member.avatarColor,
                                        }}
                                    />
                                    <span
                                        className={`text-sm truncate ${
                                            darkMode
                                                ? "text-white"
                                                : "text-gray-900"
                                        }`}>
                                        {member.name}
                                    </span>
                                    {hasConflict && (
                                        <span
                                            className="text-xs text-amber-700 dark:text-amber-400 truncate"
                                            title={conflict?.reason}>
                                            ({conflict?.reason})
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => onRemoveMember(member.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all">
                                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Drop Indicator */}
            {isOver && canDrop && (
                <div className="mt-2 p-2 bg-[#003087] text-white text-sm rounded text-center">
                    Drop to assign
                </div>
            )}
        </div>
    );
}

export function CalendarScheduler({
    timeSlots,
    members,
    onAssignMember,
    onRemoveMember,
    darkMode,
}: CalendarSchedulerProps) {
    return (
        <div
            className={`${
                darkMode ? "bg-gray-900" : "bg-gray-50"
            } rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
                <h3
                    className={`text-xl ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}>
                    24-Hour Schedule Timeline
                </h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-emerald-200 dark:bg-emerald-950 border border-emerald-500 rounded" />
                        <span
                            className={
                                darkMode ? "text-gray-300" : "text-gray-700"
                            }>
                            Fully Staffed
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 dark:bg-red-950 border border-red-500 rounded" />
                        <span
                            className={
                                darkMode ? "text-gray-300" : "text-gray-700"
                            }>
                            Understaffed
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-l-4 border-l-purple-500 bg-white dark:bg-gray-800 rounded" />
                        <span
                            className={
                                darkMode ? "text-gray-300" : "text-gray-700"
                            }>
                            Nighttime
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-4 max-h-[800px] overflow-y-auto pr-2">
                {timeSlots.map((slot) => (
                    <SlotCard
                        key={slot.time}
                        slot={slot}
                        members={members}
                        onAssignMember={(memberId) =>
                            onAssignMember(memberId, slot.time)
                        }
                        onRemoveMember={(memberId) =>
                            onRemoveMember(memberId, slot.time)
                        }
                        darkMode={darkMode}
                    />
                ))}
            </div>
        </div>
    );
}
