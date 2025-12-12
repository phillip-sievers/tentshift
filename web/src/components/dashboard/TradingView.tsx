import { useState } from "react";
import { Plus, Filter } from "lucide-react";
import { Trade, TradeType, TradeUrgency } from "../../types";
import { TradeList } from "./trading/TradeList";
import { CreateTradeModal } from "./trading/CreateTradeModal";

const MOCK_TRADES: Trade[] = [
    {
        id: "t1",
        creatorId: "2", // Jordan
        type: "handoff",
        urgency: "high",
        status: "open",
        offeredTimeSlot: {
            start: "2025-02-13T14:00:00",
            end: "2025-02-13T16:00:00",
            day: "Thursday",
        },
        note: "Have a chemistry midterm, really need coverage!",
        createdAt: "2025-02-10T10:00:00",
    },
    {
        id: "t2",
        creatorId: "3", // Sam
        type: "swap",
        urgency: "low",
        status: "open",
        offeredTimeSlot: {
            start: "2025-02-15T12:00:00",
            end: "2025-02-15T14:00:00",
            day: "Saturday",
        },
        note: "Prefer something on Sunday instead.",
        createdAt: "2025-02-11T09:30:00",
    },
];

interface TradingViewProps {
    currentUserId: string;
}

export function TradingView({ currentUserId }: TradingViewProps) {
    const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [filterType, setFilterType] = useState<"all" | "handoff" | "swap">(
        "all"
    );

    const handleCreateTrade = (data: {
        shiftId: string;
        type: TradeType;
        urgency: TradeUrgency;
        note: string;
        offeredTimeSlot: { start: string; end: string; day: string };
    }) => {
        const newTrade: Trade = {
            id: `t${Date.now()}`,
            creatorId: currentUserId,
            type: data.type,
            urgency: data.urgency,
            status: "open",
            offeredTimeSlot: data.offeredTimeSlot,
            note: data.note,
            createdAt: new Date().toISOString(),
        };
        setTrades([newTrade, ...trades]);
    };

    const handleAcceptTrade = (tradeId: string) => {
        // In a real app, this would make an API call
        // For now, we'll just remove it from the list to simulate acceptance
        setTrades(trades.filter((t) => t.id !== tradeId));
        alert("Trade accepted! The schedule would now be updated.");
    };

    const handleCancelTrade = (tradeId: string) => {
        setTrades(trades.filter((t) => t.id !== tradeId));
    };

    const filteredTrades = trades.filter((t) => {
        if (filterType === "all") return true;
        return t.type === filterType;
    });

    return (
        <div className="max-w-5xl mx-auto py-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        Shift Marketplace
                    </h2>
                    <p className="text-muted-foreground">
                        View available trades or post your own.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#003087] text-white rounded-lg hover:bg-[#00246b] transition-colors font-medium shadow-sm">
                    <Plus className="w-5 h-5" />
                    Post New Trade
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex bg-muted/30 p-1 rounded-lg border">
                    {(["all", "handoff", "swap"] as const).map((ft) => (
                        <button
                            key={ft}
                            onClick={() => setFilterType(ft)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                                filterType === ft
                                    ? "bg-white dark:bg-gray-800 text-[#003087] dark:text-white shadow-sm ring-1 ring-black/5"
                                    : "text-muted-foreground hover:text-[#003087] hover:bg-white/60 hover:shadow-sm transition-all duration-200"
                            }`}>
                            {ft.charAt(0).toUpperCase() + ft.slice(1)}s
                        </button>
                    ))}
                </div>
            </div>

            <TradeList
                trades={filteredTrades}
                currentUserId={currentUserId}
                onAccept={handleAcceptTrade}
                onCancel={handleCancelTrade}
            />

            {isCreateModalOpen && (
                <CreateTradeModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSubmit={handleCreateTrade}
                />
            )}
        </div>
    );
}
