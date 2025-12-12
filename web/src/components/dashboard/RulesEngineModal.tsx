import { useState } from "react";
import { X, Settings, Sun, Moon } from "lucide-react";
import type { PhaseSettings, Phase } from "../../types";

interface RulesEngineModalProps {
    currentSettings: PhaseSettings;
    onSave: (settings: PhaseSettings) => void;
    onClose: () => void;
}

export function RulesEngineModal({
    currentSettings,
    onSave,
    onClose,
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
            <div className="bg-background dark:bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                        <label className="block mb-3 text-foreground">
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
                                                : "border-gray-300 bg-secondary/20 text-foreground hover:border-gray-400 dark:border-gray-600"
                                        }`}>
                                        <div className="text-lg mb-1">{p}</div>
                                        <div
                                            className={`text-xs ${
                                                phase === p
                                                    ? "text-white/80"
                                                    : "text-muted-foreground"
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
                        <p className="mt-3 text-sm text-muted-foreground italic">
                            {phaseDescriptions[phase]}
                        </p>
                    </div>

                    {/* Staffing Requirements */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Daytime */}
                        <div className="bg-blue-50 dark:bg-gray-800/50 p-5 rounded-lg border-2 border-blue-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Sun className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <label className="text-foreground">
                                    Daytime Requirement
                                </label>
                            </div>
                            <p className="text-sm mb-3 text-muted-foreground">
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
                                    className="bg-background border rounded px-4 py-2 w-24 text-center text-foreground border-input"
                                />
                                <span className="text-muted-foreground">
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
                        <div className="bg-purple-50 dark:bg-gray-800/50 p-5 rounded-lg border-2 border-purple-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-4">
                                <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <label className="text-foreground">
                                    Nighttime Requirement
                                </label>
                            </div>
                            <p className="text-sm mb-3 text-muted-foreground">
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
                                    className="bg-background border rounded px-4 py-2 w-24 text-center text-foreground border-input"
                                />
                                <span className="text-muted-foreground">
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
                    <div className="bg-secondary/20 border-2 rounded-lg p-5 border-border">
                        <h4 className="mb-3 text-foreground">
                            Configuration Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="text-foreground">
                                <span className="text-muted-foreground mr-1">
                                    Phase:
                                </span>
                                <span className="px-2 py-1 bg-[#003087] text-white rounded ml-1">
                                    {phase}
                                </span>
                            </div>
                            <div className="text-foreground">
                                <span className="text-muted-foreground mr-1">
                                    Daytime (7 AM - 1 AM):
                                </span>
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded ml-1">
                                    {daytimeReq} people
                                </span>
                            </div>
                            <div className="text-foreground">
                                <span className="text-muted-foreground mr-1">
                                    Nighttime (1 AM - 7 AM):
                                </span>
                                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded ml-1">
                                    {nighttimeReq} people
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
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
