"use client";

import { useTheme } from "next-themes";
import { useState, useTransition, useEffect } from "react";
import { updateTentName } from "@/app/actions/tent-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Upload } from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface HeaderProps {
    tentId: string;
    tentName: string;
    tentImage: string | null;
    userAvatar: string | null;
    userName: string | null;
}

export function Header({
    tentId,
    tentName,
    tentImage,
    userAvatar,
    userName,
}: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [name, setName] = useState(tentName);
    const [isPending, startTransition] = useTransition();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSaveName = () => {
        if (name.trim() === "") return;

        setIsEditingName(false);
        if (name === tentName) return;

        startTransition(async () => {
            const result = await updateTentName(tentId, name);
            if (result.success) {
                toast.success("Team name updated");
            } else {
                toast.error("Failed to update team name");
                setName(tentName); // Revert on error
            }
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSaveName();
        } else if (e.key === "Escape") {
            setIsEditingName(false);
            setName(tentName);
        }
    };

    if (!mounted) {
        return (
            <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4"></div>
                <div className="flex items-center gap-4"></div>
            </header>
        );
    }

    const isDarkMode = theme === "dark";

    return (
        <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                {/* Team Avatar / Image Trigger */}
                <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-10 w-10 rounded-full p-0 overflow-hidden hover:opacity-80 transition-opacity">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={tentImage || ""} alt={name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                                <Pencil className="h-3 w-3 text-white" />
                            </div>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Update Team Picture</DialogTitle>
                            <DialogDescription>
                                Upload a new picture for your team (Tent).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="picture">Picture</Label>
                                <Input id="picture" type="file" disabled />
                                <p className="text-[0.8rem] text-muted-foreground">
                                    File upload is coming soon.
                                </p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setIsUploadOpen(false)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Editable Team Name */}
                <div className="flex flex-col">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Team
                    </span>
                    {isEditingName ? (
                        <Input
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleSaveName}
                            onKeyDown={handleKeyDown}
                            className="h-7 w-[200px] px-2 py-1 text-base font-bold"
                            disabled={isPending}
                        />
                    ) : (
                        <div
                            onClick={() => setIsEditingName(true)}
                            className="group flex cursor-pointer items-center gap-2 rounded px-1 -ml-1 hover:bg-muted/50">
                            <h1 className="text-lg font-bold leading-none">
                                {name}
                            </h1>
                            <Pencil className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                    className="h-8 w-8 rounded-full px-0">
                    {isDarkMode ? "☀️" : "🌙"}
                </Button>

                {/* User Profile (Right side) */}
                <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-medium">
                            {userName || "User"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Member
                        </span>
                    </div>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar || ""} />
                        <AvatarFallback>
                            {userName?.substring(0, 2).toUpperCase() || "ME"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
