import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const userProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
    });

    // If profile doesn't exist, we might want to create it or handle it.
    // For now, let's assume we redirect to onboarding if no profile or no tent_id.
    // If we strictly follow the plan: "If user.tent_id is null -> Redirect to /onboarding"

    if (!userProfile || !userProfile.tentId) {
        redirect("/onboarding");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="border-b p-4">
                <h1 className="text-xl font-bold">TentShift Dashboard</h1>
            </header>
            <main className="flex-1 p-4">{children}</main>
        </div>
    );
}
