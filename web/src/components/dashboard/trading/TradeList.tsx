import { Trade } from "../../../types";
import { TradeItem } from "./TradeItem";
import { Coffee } from "lucide-react";

interface TradeListProps {
    trades: Trade[];
    currentUserId: string;
    onAccept: (tradeId: string) => void;
    onCancel: (tradeId: string) => void;
}

export function TradeList({
    trades,
    currentUserId,
    onAccept,
    onCancel,
}: TradeListProps) {
    if (trades.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/10 rounded-lg border border-dashed">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/20 mb-4">
                    <Coffee className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                    No active trades
                </h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    There are currently no shifts available for trade. Check
                    back later or create a new trade offer.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {trades.map((trade) => (
                <TradeItem
                    key={trade.id}
                    trade={trade}
                    currentUserId={currentUserId}
                    onAccept={onAccept}
                    onCancel={onCancel}
                />
            ))}
        </div>
    );
}
