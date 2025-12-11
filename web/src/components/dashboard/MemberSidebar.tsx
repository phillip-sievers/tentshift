import { useDrag } from "react-dnd";
import { GripVertical, AlertCircle } from "lucide-react";
import type { Member } from "../../types";

interface MemberSidebarProps {
    members: Member[];
    darkMode: boolean;
}

interface DraggableMemberCardProps {
    member: Member;
    darkMode: boolean;
}

function DraggableMemberCard({ member, darkMode }: DraggableMemberCardProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "MEMBER",
        item: { id: member.id, name: member.name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const hasUnavailability =
        member.unavailable && member.unavailable.length > 0;

    return (
        <div
            ref={drag as unknown as React.Ref<HTMLDivElement>}
            className={`${
                darkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
            } border-2 rounded-lg p-3 cursor-move transition-all hover:shadow-lg hover:scale-105 ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}>
            <div className="flex items-center gap-3">
                <GripVertical
                    className={`w-5 h-5 ${
                        darkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                />
                <div
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                />
                <div className="flex-1 min-w-0">
                    <div
                        className={`truncate ${
                            darkMode ? "text-white" : "text-gray-900"
                        }`}>
                        {member.name}
                    </div>
                    {hasUnavailability && (
                        <div className="flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3 text-amber-500" />
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                                {member.unavailable!.length} unavailable slot
                                {member.unavailable!.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Unavailability Details */}
            {hasUnavailability && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
                    {member.unavailable?.map((slot, idx) => (
                        <div
                            key={idx}
                            className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                                {slot.start} - {slot.end}
                            </span>
                            <span className="truncate">{slot.reason}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function MemberSidebar({ members, darkMode }: MemberSidebarProps) {
    return (
        <div
            className={`${
                darkMode ? "bg-gray-900" : "bg-gray-50"
            } rounded-lg p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto`}>
            <h3
                className={`text-xl mb-4 ${
                    darkMode ? "text-white" : "text-gray-900"
                }`}>
                Team Members
            </h3>
            <p
                className={`text-sm mb-4 ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                Drag members to time slots to assign shifts
            </p>
            <div className="space-y-3">
                {members.map((member) => (
                    <DraggableMemberCard
                        key={member.id}
                        member={member}
                        darkMode={darkMode}
                    />
                ))}
            </div>
        </div>
    );
}
