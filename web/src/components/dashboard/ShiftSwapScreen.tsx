import { ArrowLeft, Clock, User, CheckCircle } from "lucide-react";
import type { Shift } from "../../types";

interface ShiftSwapScreenProps {
    onBack: () => void;
    darkMode: boolean;
}

const MOCK_SWAPS: Shift[] = [
    {
        id: "1",
        date: "Dec 9, 2025",
        time: "2:00 PM - 4:00 PM",
        assignedTo: "Jordan Smith",
        tradedBy: "Jordan Smith",
        isAvailable: true,
    },
    {
        id: "2",
        date: "Dec 9, 2025",
        time: "10:00 PM - 12:00 AM",
        assignedTo: "Sam Taylor",
        tradedBy: "Sam Taylor",
        isAvailable: true,
    },
    {
        id: "3",
        date: "Dec 10, 2025",
        time: "6:00 AM - 8:00 AM",
        assignedTo: "Morgan Lee",
        tradedBy: "Morgan Lee",
        isAvailable: true,
    },
    {
        id: "4",
        date: "Dec 10, 2025",
        time: "3:00 PM - 5:00 PM",
        assignedTo: "Alex Chen",
        tradedBy: "Alex Chen",
        isAvailable: false,
    },
];

export function ShiftSwapScreen({ onBack, darkMode }: ShiftSwapScreenProps) {
    const handleAcceptTrade = (shiftId: string) => {
        alert(
            `Shift ${shiftId} accepted! The original assignee will be notified.`
        );
    };

    const availableSwaps = MOCK_SWAPS.filter((swap) => swap.isAvailable);
    const completedSwaps = MOCK_SWAPS.filter((swap) => !swap.isAvailable);

    return (
        <div
            className={`${
                darkMode ? "bg-gray-800" : "bg-gray-200"
            } rounded-[3rem] p-4 shadow-2xl`}>
            <div
                className={`${
                    darkMode ? "bg-gray-900" : "bg-white"
                } rounded-[2.5rem] overflow-hidden`}>
                {/* Status Bar */}
                <div
                    className={`${
                        darkMode ? "bg-gray-900" : "bg-white"
                    } px-6 py-3 flex items-center justify-between text-sm`}>
                    <span className={darkMode ? "text-white" : "text-gray-900"}>
                        9:41
                    </span>
                    <div className="flex items-center gap-1">
                        <div
                            className={`w-4 h-4 rounded ${
                                darkMode ? "bg-gray-700" : "bg-gray-300"
                            }`}
                        />
                        <div
                            className={`w-4 h-4 rounded ${
                                darkMode ? "bg-gray-700" : "bg-gray-300"
                            }`}
                        />
                        <div
                            className={`w-4 h-4 rounded ${
                                darkMode ? "bg-gray-700" : "bg-gray-300"
                            }`}
                        />
                    </div>
                </div>

                {/* Header */}
                <div className="bg-[#003087] text-white px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl">Shift Swaps</h1>
                        <p className="text-sm opacity-80">
                            {availableSwaps.length} available
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div
                    className={`${
                        darkMode ? "bg-gray-900" : "bg-white"
                    } min-h-[600px] p-6`}>
                    {/* Available Swaps */}
                    <div className="mb-8">
                        <h2
                            className={`text-lg mb-4 ${
                                darkMode ? "text-white" : "text-gray-900"
                            }`}>
                            Available Shifts
                        </h2>
                        <div className="space-y-3">
                            {availableSwaps.map((swap) => (
                                <div
                                    key={swap.id}
                                    className={`${
                                        darkMode
                                            ? "bg-gray-800 border-gray-700"
                                            : "bg-gray-50 border-gray-200"
                                    } border-2 rounded-xl p-4`}>
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock
                                                    className={`w-4 h-4 ${
                                                        darkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                />
                                                <span
                                                    className={
                                                        darkMode
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }>
                                                    {swap.time}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <User
                                                    className={`w-4 h-4 ${
                                                        darkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}
                                                />
                                                <span
                                                    className={`text-sm ${
                                                        darkMode
                                                            ? "text-gray-400"
                                                            : "text-gray-600"
                                                    }`}>
                                                    Originally: {swap.tradedBy}
                                                </span>
                                            </div>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${
                                                darkMode
                                                    ? "bg-blue-900 text-blue-300"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {swap.date}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleAcceptTrade(swap.id)
                                        }
                                        className="w-full bg-[#003087] hover:bg-[#00246b] text-white py-3 rounded-lg transition-all">
                                        Accept Trade
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completed Swaps */}
                    {completedSwaps.length > 0 && (
                        <div>
                            <h2
                                className={`text-lg mb-4 ${
                                    darkMode ? "text-white" : "text-gray-900"
                                }`}>
                                Recently Completed
                            </h2>
                            <div className="space-y-3">
                                {completedSwaps.map((swap) => (
                                    <div
                                        key={swap.id}
                                        className={`${
                                            darkMode
                                                ? "bg-gray-800/50 border-gray-700"
                                                : "bg-gray-50/50 border-gray-200"
                                        } border-2 rounded-xl p-4 opacity-60`}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock
                                                        className={`w-4 h-4 ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}
                                                    />
                                                    <span
                                                        className={
                                                            darkMode
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }>
                                                        {swap.time}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                    <span
                                                        className={`text-sm ${
                                                            darkMode
                                                                ? "text-gray-400"
                                                                : "text-gray-600"
                                                        }`}>
                                                        Trade completed
                                                    </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-1 rounded ${
                                                    darkMode
                                                        ? "bg-gray-700 text-gray-400"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}>
                                                {swap.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
