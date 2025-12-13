import { useState } from "react";
import { X, Calendar, Clock, AlertTriangle } from "lucide-react";
import { TradeType, TradeUrgency } from "../../../types";

interface ShiftCommon {
    id: string;
    startTime: string; // ISO
    endTime: string;
    tentId: string;
}

interface CreateTradeModalProps {
    onClose: () => void;
    availableShifts: any[]; // Using any for now to match DB types, will refine
    onSubmit: (data: {
        shiftId: string;
        type: TradeType;
        urgency: TradeUrgency;
        note: string;
        offeredTimeSlot: { start: string; end: string; day: string };
    }) => void;
}

export function CreateTradeModal({
    onClose,
    onSubmit,
    availableShifts,
}: CreateTradeModalProps) {
    const [selectedShiftId, setSelectedShiftId] = useState<string>("");
    const [type, setType] = useState<TradeType>("handoff");
    const [urgency, setUrgency] = useState<TradeUrgency>("medium");
    const [note, setNote] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const shift = availableShifts.find((s) => s.id === selectedShiftId);
        if (!shift) return;

        const startDate = new Date(shift.startTime);
        const endDate = new Date(shift.endTime);
        const dayName = startDate.toLocaleDateString("en-US", {
            weekday: "long",
        });

        onSubmit({
            shiftId: shift.id,
            type,
            urgency,
            note,
            offeredTimeSlot: {
                start: shift.startTime,
                end: shift.endTime,
                day: dayName,
            },
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-lg overflow-hidden border">
                <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="text-lg font-semibold">
                        Post a Trade Offer
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* 1. Select Shift */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Which shift do you want to trade?
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                            {availableShifts.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">
                                    You have no upcoming shifts to trade.
                                </p>
                            )}
                            {availableShifts.map((shift) => {
                                const start = new Date(shift.startTime);
                                const end = new Date(shift.endTime);
                                const day = start.toLocaleDateString("en-US", {
                                    weekday: "long",
                                });
                                const timeRange = `${start.toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" }
                                )} - ${end.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}`;

                                return (
                                    <div
                                        key={shift.id}
                                        onClick={() =>
                                            setSelectedShiftId(shift.id)
                                        }
                                        className={`
                                        relative flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-sm
                                        ${
                                            selectedShiftId === shift.id
                                                ? "border-[#003087] bg-blue-50/50 ring-1 ring-[#003087]"
                                                : "border-border hover:bg-muted/50 hover:border-gray-300 dark:hover:border-gray-700"
                                        }
                                    `}>
                                        <div
                                            className={`p-2 rounded-full bg-muted`}>
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">
                                                {day}
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {timeRange}
                                            </div>
                                        </div>
                                        {selectedShiftId === shift.id && (
                                            <div className="w-3 h-3 rounded-full bg-[#003087]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 2. Trade Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Trade Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) =>
                                    setType(e.target.value as TradeType)
                                }
                                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                                <option value="handoff">
                                    Handoff (Give away)
                                </option>
                                <option value="swap">Swap (Exchange)</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Urgency
                            </label>
                            <select
                                value={urgency}
                                onChange={(e) =>
                                    setUrgency(e.target.value as TradeUrgency)
                                }
                                className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                                <option value="low">Low Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="high">High Priority</option>
                            </select>
                        </div>
                    </div>

                    {/* 3. Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            Note (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="e.g. Can anyone take this? I have a dentist appointment."
                            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!selectedShiftId}
                            className="px-4 py-2 text-sm font-medium bg-[#003087] text-white rounded-md hover:bg-[#00246b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Post Trade Offer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
