import { useState } from "react";
import { X, Settings, Sun, Moon } from "lucide-react";
import type { PhaseSettings, Phase } from "../../types";

interface RulesEngineModalProps {
    currentSettings: PhaseSettings;
    onSave: (settings: PhaseSettings) => void;
    onClose: () => void;
    darkMode: boolean;
}

export function RulesEngineModal({
    currentSettings,
    onSave,
    onClose,
    darkMode,
}: RulesEngineModalProps) {
    const [phase, setPhase] = useState<Phase>(currentSettings.currentPhase);
    const [daytimeReq, setDaytimeReq] = useState(
        currentSettings.daytimeRequirement
    );
    const [nighttimeReq, setNighttimeReq] = useState(
        currentSettings.nighttimeRequirement
    );

    const handleSave = () => {
        onSave({
            currentPhase: phase,
            daytimeRequirement: daytimeReq,
            nighttimeRequirement: nighttimeReq,
        });
    };

    const phaseDescriptions: Record<Phase, string> = {
        Black: "Most restrictive - Highest staffing requirements for critical periods",
        Blue: "Medium restrictions - Balanced staffing for regular tenting",
        White: "Least restrictive - Minimum staffing requirements",
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
                className={`${
                    darkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className="sticky top-0 bg-[#003087] text-white p-6 rounded-t-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Settings className="w-6 h-6" />
                        <h2 className="text-2xl">Rules Engine Configuration</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Phase Selection */}
                    <div>
                        <label
                            className={`block mb-3 ${
                                darkMode ? "text-white" : "text-gray-900"
                            }`}>
                            Current Phase
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(["Black", "Blue", "White"] as Phase[]).map(
                                (p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPhase(p)}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                            phase === p
                                                ? "border-[#003087] bg-[#003087] text-white"
                                                : darkMode
                                                ? "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                                                : "border-gray-300 bg-gray-50 text-gray-700 hover:border-gray-400"
                                        }`}>
                                        <div className="text-lg mb-1">{p}</div>
                                        <div
                                            className={`text-xs ${
                                                phase === p
                                                    ? "text-white/80"
                                                    : darkMode
                                                    ? "text-gray-400"
                                                    : "text-gray-500"
                                            }`}>
                                            {p === "Black"
                                                ? "High"
                                                : p === "Blue"
                                                ? "Medium"
                                                : "Low"}
                                        </div>
                                    </button>
                                )
                            )}
                        </div>
                        <p
                            className={`mt-3 text-sm ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            } italic`}>
                            {phaseDescriptions[phase]}
                        </p>
                    </div>

                    {/* Staffing Requirements */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Daytime */}
                        <div
                            className={`${
                                darkMode ? "bg-gray-700" : "bg-blue-50"
                            } p-5 rounded-lg border-2 ${
                                darkMode ? "border-gray-600" : "border-blue-200"
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Sun
                                    className={`w-5 h-5 ${
                                        darkMode
                                            ? "text-yellow-400"
                                            : "text-yellow-600"
                                    }`}
                                />
                                <label
                                    className={
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }>
                                    Daytime Requirement
                                </label>
                            </div>
                            <p
                                className={`text-sm mb-3 ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                }`}>
                                7:00 AM - 1:00 AM
                            </p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={daytimeReq}
                                    onChange={(e) =>
                                        setDaytimeReq(
                                            parseInt(e.target.value) || 1
                                        )
                                    }
                                    className={`${
                                        darkMode
                                            ? "bg-gray-600 border-gray-500 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } border-2 rounded px-4 py-2 w-24 text-center`}
                                />
                                <span
                                    className={
                                        darkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }>
                                    people required
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={daytimeReq}
                                onChange={(e) =>
                                    setDaytimeReq(parseInt(e.target.value))
                                }
                                className="w-full mt-3"
                            />
                        </div>

                        {/* Nighttime */}
                        <div
                            className={`${
                                darkMode ? "bg-gray-700" : "bg-purple-50"
                            } p-5 rounded-lg border-2 ${
                                darkMode
                                    ? "border-gray-600"
                                    : "border-purple-200"
                            }`}>
                            <div className="flex items-center gap-2 mb-4">
                                <Moon
                                    className={`w-5 h-5 ${
                                        darkMode
                                            ? "text-purple-400"
                                            : "text-purple-600"
                                    }`}
                                />
                                <label
                                    className={
                                        darkMode
                                            ? "text-white"
                                            : "text-gray-900"
                                    }>
                                    Nighttime Requirement
                                </label>
                            </div>
                            <p
                                className={`text-sm mb-3 ${
                                    darkMode ? "text-gray-400" : "text-gray-600"
                                }`}>
                                1:00 AM - 7:00 AM
                            </p>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={nighttimeReq}
                                    onChange={(e) =>
                                        setNighttimeReq(
                                            parseInt(e.target.value) || 1
                                        )
                                    }
                                    className={`${
                                        darkMode
                                            ? "bg-gray-600 border-gray-500 text-white"
                                            : "bg-white border-gray-300 text-gray-900"
                                    } border-2 rounded px-4 py-2 w-24 text-center`}
                                />
                                <span
                                    className={
                                        darkMode
                                            ? "text-gray-300"
                                            : "text-gray-700"
                                    }>
                                    people required
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={nighttimeReq}
                                onChange={(e) =>
                                    setNighttimeReq(parseInt(e.target.value))
                                }
                                className="w-full mt-3"
                            />
                        </div>
                    </div>

                    {/* Summary */}
                    <div
                        className={`${
                            darkMode
                                ? "bg-gray-700 border-gray-600"
                                : "bg-gray-50 border-gray-200"
                        } border-2 rounded-lg p-5`}>
                        <h4
                            className={`mb-3 ${
                                darkMode ? "text-white" : "text-gray-900"
                            }`}>
                            Configuration Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div
                                className={
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                }>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Phase:
                                </span>{" "}
                                <span className="px-2 py-1 bg-[#003087] text-white rounded ml-2">
                                    {phase}
                                </span>
                            </div>
                            <div
                                className={
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                }>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Daytime (7 AM - 1 AM):
                                </span>{" "}
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded ml-2">
                                    {daytimeReq} people
                                </span>
                            </div>
                            <div
                                className={
                                    darkMode ? "text-gray-300" : "text-gray-700"
                                }>
                                <span className="text-gray-500 dark:text-gray-400">
                                    Nighttime (1 AM - 7 AM):
                                </span>{" "}
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded ml-2">
                                    {nighttimeReq} people
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className={`px-6 py-3 rounded-lg ${
                                darkMode
                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            } transition-colors`}>
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-[#003087] text-white rounded-lg hover:bg-[#00246b] transition-colors">
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
