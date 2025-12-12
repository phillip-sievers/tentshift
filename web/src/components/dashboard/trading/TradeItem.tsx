import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    Clock,
    AlertCircle,
    ArrowRightLeft,
    ArrowRight,
    Share2,
    Check,
    X,
} from "lucide-react";
import { Trade } from "../../../types";

interface TradeItemProps {
    trade: Trade;
    currentUserId: string;
    onAccept: (tradeId: string) => void;
    onCancel: (tradeId: string) => void;
}

export function TradeItem({
    trade,
    currentUserId,
    onAccept,
    onCancel,
}: TradeItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showCopied, setShowCopied] = useState(false);

    const isOwner = trade.creatorId === currentUserId;

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Mock share functionality
        navigator.clipboard.writeText(
            `https://tentshift.com/trade/${trade.id}`
        );
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "high":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
            case "medium":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "low":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden mb-3 transition-all duration-200 hover:shadow-md hover:border-[#003087]/30">
            <div
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    {/* Icon based on Type */}
                    <div
                        className={`p-2 rounded-full ${
                            trade.type === "swap"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                        }`}>
                        {trade.type === "swap" ? (
                            <ArrowRightLeft className="w-5 h-5" />
                        ) : (
                            <ArrowRight className="w-5 h-5" />
                        )}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                                {trade.offeredTimeSlot.day}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-medium">
                                {trade.offeredTimeSlot.start
                                    .split("T")[1]
                                    .substring(0, 5)}{" "}
                                -{" "}
                                {trade.offeredTimeSlot.end
                                    .split("T")[1]
                                    .substring(0, 5)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Offered by{" "}
                                <span className="font-medium text-foreground">
                                    {trade.creatorId === "1"
                                        ? "Alex Chen"
                                        : "Team Member"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase ${getUrgencyColor(
                            trade.urgency
                        )}`}>
                        {trade.urgency} Priority
                    </span>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                </div>
            </div>

            {isExpanded && (
                <div className="px-4 pb-4 pt-0 border-t bg-muted/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                                DETAILS
                            </h4>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                                    <span className="text-sm">
                                        Shift Length:{" "}
                                        <span className="font-medium">
                                            2.0 Hours
                                        </span>{" "}
                                        {/* Simplify calculation for mock */}
                                    </span>
                                </div>
                                {trade.note && (
                                    <div className="flex items-start gap-2">
                                        <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                                        <span className="text-sm italic">
                                            "{trade.note}"
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3 justify-center">
                            {/* Share Button */}
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 text-sm text-[#003087] hover:underline mb-2">
                                {showCopied ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Share2 className="w-4 h-4" />
                                )}
                                {showCopied
                                    ? "Link Copied!"
                                    : "Share Trade Link"}
                            </button>

                            <div className="flex items-center gap-3 w-full justify-end">
                                {isOwner ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCancel(trade.id);
                                        }}
                                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors">
                                        Cancel Trade
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAccept(trade.id);
                                        }}
                                        className="px-6 py-2 bg-[#003087] text-white rounded-lg hover:bg-[#00246b] text-sm font-medium shadow-sm transition-colors">
                                        Accept{" "}
                                        {trade.type === "swap"
                                            ? "Swap"
                                            : "Shift"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
