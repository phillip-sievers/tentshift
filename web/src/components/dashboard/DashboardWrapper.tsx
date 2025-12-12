"use client";

import { useState, useEffect } from "react";
import { DesktopDashboard } from "@/components/dashboard/DesktopDashboard";
import { Header } from "@/components/dashboard/Header";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTheme } from "next-themes";

interface DashboardWrapperProps {
    headerProps: {
        tentId: string;
        tentName: string;
        tentImage: string | null;
        userAvatar: string | null;
        userName: string | null;
    };
}

export function DashboardWrapper({ headerProps }: DashboardWrapperProps) {
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-background transition-colors flex flex-col">
                {/* Header */}
                <div className="sticky top-0 z-50">
                    <Header {...headerProps} />
                </div>

                {/* Main Content */}
                <div className="p-6 flex-1">
                    <DesktopDashboard />
                </div>
            </div>
        </DndProvider>
    );
}
