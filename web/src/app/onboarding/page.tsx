"use client";

import { useState } from "react";
import { createTent, joinTent } from "@/app/actions/tent";

export default function OnboardingPage() {
    const [activeTab, setActiveTab] = useState<"create" | "join">("create");

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-10">
            <div className="w-full max-w-md rounded-lg border p-6 shadow-lg">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    Welcome to TentShift
                </h1>

                <div className="mb-6 flex border-b">
                    <button
                        className={`flex-1 py-2 ${
                            activeTab === "create"
                                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("create")}>
                        Create Tent
                    </button>
                    <button
                        className={`flex-1 py-2 ${
                            activeTab === "join"
                                ? "border-b-2 border-blue-500 font-bold text-blue-500"
                                : "text-gray-500"
                        }`}
                        onClick={() => setActiveTab("join")}>
                        Join Tent
                    </button>
                </div>

                {activeTab === "create" ? (
                    <form action={createTent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Tent Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="mt-1 w-full rounded border p-2 text-black"
                                placeholder="e.g., The Best Tent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">
                                Tent Type
                            </label>
                            <select
                                name="type"
                                className="mt-1 w-full rounded border p-2 text-black">
                                <option value="Black">Black</option>
                                <option value="Blue">Blue</option>
                                <option value="White">White</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600">
                            Create Tent
                        </button>
                    </form>
                ) : (
                    <form action={joinTent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Join Code
                            </label>
                            <input
                                name="code"
                                type="text"
                                required
                                className="mt-1 w-full rounded border p-2 text-black"
                                placeholder="e.g., ABC1234"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded bg-green-500 p-2 text-white hover:bg-green-600">
                            Join Tent
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
