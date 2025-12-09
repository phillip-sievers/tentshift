"use client";

import * as React from "react";
import {
    addMinutes,
    format,
    startOfDay,
    eachMinuteOfInterval,
    endOfDay,
    isWithinInterval,
} from "date-fns";
import { cn } from "@/lib/utils";
import { updateAvailability } from "@/app/actions/availability";

type AvailabilityStatus = "available" | "maybe" | "unavailable";

interface User {
    id: string;
    fullName: string | null;
    email: string | null;
}

interface Availability {
    id: string;
    userId: string;
    startTime: Date;
    endTime: Date;
    status: string;
}

interface AvailabilityGridProps {
    users: User[];
    currentUser: User;
    date: Date;
    existingAvailabilities: Availability[];
}

export function AvailabilityGrid({
    users,
    currentUser,
    date,
    existingAvailabilities,
}: AvailabilityGridProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState<Date | null>(null);
    const [dragEnd, setDragEnd] = React.useState<Date | null>(null);
    const [dragStatus, setDragStatus] =
        React.useState<AvailabilityStatus>("available");

    // Generate 15-minute slots for the day
    const slots = React.useMemo(() => {
        const start = startOfDay(date);
        const end = endOfDay(date);
        return eachMinuteOfInterval({ start, end }, { step: 15 });
    }, [date]);

    const handleMouseDown = (slot: Date, status: AvailabilityStatus) => {
        setIsDragging(true);
        setDragStart(slot);
        setDragEnd(slot);
        setDragStatus(status);
    };

    const handleMouseEnter = (slot: Date) => {
        if (isDragging) {
            setDragEnd(slot);
        }
    };

    const handleMouseUp = async () => {
        if (isDragging && dragStart && dragEnd) {
            setIsDragging(false);

            // Determine start and end time (drag might be backwards)
            const start = dragStart < dragEnd ? dragStart : dragEnd;
            const end = dragStart < dragEnd ? dragEnd : dragStart;

            // Add 15 mins to end time because slot is the start of the interval
            const actualEnd = addMinutes(end, 15);

            await updateAvailability(start, actualEnd, dragStatus);

            setDragStart(null);
            setDragEnd(null);
        }
    };

    const getSlotStatus = (user: User, slot: Date) => {
        // Check if currently dragging over this slot
        if (isDragging && user.id === currentUser.id && dragStart && dragEnd) {
            const start = dragStart < dragEnd ? dragStart : dragEnd;
            const end = dragStart < dragEnd ? dragEnd : dragStart;
            // Use isWithinInterval but handle the end time inclusive/exclusive logic
            // For visual feedback, we want to include the end slot if it's the drag target
            if (slot >= start && slot <= end) {
                return dragStatus;
            }
        }

        // Check existing availability
        const availability = existingAvailabilities.find(
            (a) =>
                a.userId === user.id && slot >= a.startTime && slot < a.endTime
        );

        return availability
            ? (availability.status as AvailabilityStatus)
            : null;
    };

    const getStatusColor = (status: AvailabilityStatus | null) => {
        switch (status) {
            case "available":
                return "bg-green-500/50 hover:bg-green-500/70";
            case "maybe":
                return "bg-yellow-500/50 hover:bg-yellow-500/70";
            case "unavailable":
                return "bg-red-500/50 hover:bg-red-500/70";
            default:
                return "hover:bg-accent/50";
        }
    };

    return (
        <div className="flex flex-col select-none" onMouseUp={handleMouseUp}>
            {/* Header */}
            <div className="flex sticky top-0 z-10 bg-background border-b">
                <div className="w-20 flex-shrink-0 p-2 border-r font-bold">
                    Time
                </div>
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex-1 p-2 text-center border-r min-w-[100px] truncate">
                        {user.fullName || user.email}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div className="flex-1">
                {slots.map((slot) => (
                    <div key={slot.toISOString()} className="flex border-b h-8">
                        {/* Time Label */}
                        <div className="w-20 flex-shrink-0 p-1 text-xs text-muted-foreground border-r flex items-center justify-end pr-2">
                            {format(slot, "h:mm a")}
                        </div>

                        {/* User Slots */}
                        {users.map((user) => {
                            const isCurrentUser = user.id === currentUser.id;
                            const status = getSlotStatus(user, slot);

                            return (
                                <div
                                    key={`${user.id}-${slot.toISOString()}`}
                                    className={cn(
                                        "flex-1 border-r transition-colors",
                                        getStatusColor(status),
                                        isCurrentUser
                                            ? "cursor-pointer"
                                            : "cursor-default"
                                    )}
                                    onMouseDown={() =>
                                        isCurrentUser &&
                                        handleMouseDown(slot, "available")
                                    } // Default to available on click
                                    onMouseEnter={() =>
                                        isCurrentUser && handleMouseEnter(slot)
                                    }>
                                    {/* Content */}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
