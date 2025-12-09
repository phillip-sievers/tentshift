import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { profiles, availabilities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { AvailabilityGrid } from "@/components/availability/AvailabilityGrid";

export default async function AvailabilityPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch current user profile
    const currentUserProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
    });

    if (!currentUserProfile || !currentUserProfile.tentId) {
        redirect("/onboarding");
    }

    // Fetch all members of the tent
    const tentMembers = await db.query.profiles.findMany({
        where: eq(profiles.tentId, currentUserProfile.tentId),
    });

    // Transform to User interface expected by grid
    const users = tentMembers.map((member) => ({
        id: member.id,
        fullName: member.fullName,
        email: member.fullName, // Fallback if no email column in profile, but we stored email in fullName in actions/tent.ts
    }));

    // Fetch availabilities for the tent
    // For simplicity, fetching all for now. In real app, filter by date range.
    const tentAvailabilities = await db.query.availabilities.findMany({
        where: eq(availabilities.tentId, currentUserProfile.tentId),
    });

    const currentUser = {
        id: currentUserProfile.id,
        fullName: currentUserProfile.fullName,
        email: currentUserProfile.fullName,
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b">
                <h2 className="text-2xl font-bold">Availability</h2>
                <p className="text-muted-foreground">
                    Drag to mark your availability for the K-Ville line.
                </p>
            </div>
            <div className="flex-1 overflow-auto">
                <AvailabilityGrid
                    users={users}
                    currentUser={currentUser}
                    date={new Date()} // Today
                    existingAvailabilities={tentAvailabilities}
                />
            </div>
        </div>
    );
}
