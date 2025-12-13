"use client";

import { useState } from "react";
import { createTent, joinTent } from "@/app/actions/tent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const [loading, setLoading] = useState(false);

    // Wrapper to handle server action with toast feedback
    const handleAction = async (
        formData: FormData,
        action: (formData: FormData) => Promise<void>
    ) => {
        setLoading(true);
        try {
            await action(formData);
            // Redirect happens in action, but if it fell through:
            toast.success("Success!");
        } catch (error: unknown) {
            console.error(error);
            // If the redirect happens, this might not fire, which is fine.
            // If error is thrown, we catch it.
            // Note: In Next.js server actions, redirect throws an error usually caught by Next.js.
            // We need to be careful not to catch the redirect error as a failure.
            if (error instanceof Error && error.message === "NEXT_REDIRECT") {
                throw error;
            }
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
            <div className="w-full max-w-md">
                <Card className="border-border shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-primary">
                            Welcome to TentShift
                        </CardTitle>
                        <CardDescription>
                            Get started by creating a new tent or joining an
                            existing one.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="create" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="create">
                                    Create Tent
                                </TabsTrigger>
                                <TabsTrigger value="join">
                                    Join Tent
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="create">
                                <form
                                    action={(formData) =>
                                        handleAction(formData, createTent)
                                    }
                                    className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="tent-name">
                                            Tent Name
                                        </Label>
                                        <Input
                                            id="tent-name"
                                            name="name"
                                            type="text"
                                            required
                                            placeholder="e.g., The Best Tent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tent-type">
                                            Tent Type
                                        </Label>
                                        <Select
                                            name="type"
                                            defaultValue="Black">
                                            <SelectTrigger id="tent-type">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Black">
                                                    Black
                                                </SelectItem>
                                                <SelectItem value="Blue">
                                                    Blue
                                                </SelectItem>
                                                <SelectItem value="White">
                                                    White
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Tent"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="join">
                                <form
                                    action={(formData) =>
                                        handleAction(formData, joinTent)
                                    }
                                    className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="join-code">
                                            Join Code
                                        </Label>
                                        <Input
                                            id="join-code"
                                            name="code"
                                            type="text"
                                            required
                                            placeholder="e.g., ABC1234"
                                            className="uppercase"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        variant="secondary"
                                        disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Joining...
                                            </>
                                        ) : (
                                            "Join Tent"
                                        )}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
