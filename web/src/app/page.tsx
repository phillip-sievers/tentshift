"use client";

import { useState } from "react";
import { DesktopDashboard } from "@/components/dashboard/DesktopDashboard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
    const [darkMode, setDarkMode] = useState(false);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={darkMode ? "dark" : ""}>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                    {/* Header Navigation */}
                    <div className="bg-[#003087] text-white p-4 sticky top-0 z-50">
                        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                            <h1 className="text-2xl">K-Ville Tent Manager</h1>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors cursor-pointer">
                                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        <DesktopDashboard darkMode={darkMode} />
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}
