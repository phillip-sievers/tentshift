"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            router.push("/");
            router.refresh();
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
        } else {
            alert("Check your email for the confirmation link!");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
                <h1 className="text-4xl font-bold">Sign In</h1>
                <form className="mt-8 flex w-full max-w-md flex-col space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="rounded border p-2 text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="rounded border p-2 text-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex space-x-4">
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className="flex-1 rounded bg-blue-500 p-2 text-white hover:bg-blue-600 disabled:opacity-50">
                            {loading ? "Loading..." : "Sign In"}
                        </button>
                        <button
                            onClick={handleSignUp}
                            disabled={loading}
                            className="flex-1 rounded bg-green-500 p-2 text-white hover:bg-green-600 disabled:opacity-50">
                            {loading ? "Loading..." : "Sign Up"}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
