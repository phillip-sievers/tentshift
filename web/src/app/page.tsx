import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import {
    profiles,
    tents,
    shifts,
    assignments,
    availabilities,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { DashboardWrapper } from "@/components/dashboard/DashboardWrapper";

export default async function Home() {
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

    if (!userProfile || !userProfile.tentId) {
        redirect("/onboarding");
    }

    const tent = await db.query.tents.findFirst({
        where: eq(tents.id, userProfile.tentId),
    });

    if (!tent) {
        redirect("/onboarding");
    }

    // Fetch all members of the tent
    const members = await db.query.profiles.findMany({
        where: eq(profiles.tentId, tent.id),
    });

    // Fetch all shifts for the tent
    const shiftsData = await db.query.shifts.findMany({
        where: eq(shifts.tentId, tent.id),
        with: {
            assignments: {
                with: {
                    user: true,
                },
            },
        },
    });

    const assignmentsData = await db.query.assignments.findMany({
        with: {
            shift: true,
            user: true,
        },
        where: (assignments, { inArray }) =>
            inArray(
                assignments.shiftId,
                shiftsData.map((s) => s.id)
            ),
    });

    // Fetch availabilities for the tent
    const availabilitiesData = await db.query.availabilities.findMany({
        where: eq(availabilities.tentId, tent.id),
    });

    return (
        <DashboardWrapper
            headerProps={{
                tentId: tent.id,
                tentName: tent.name,
                tentImage: tent.imageUrl,
                userAvatar: userProfile.avatarUrl,
                userName: userProfile.fullName,
            }}
            members={members}
            shifts={shiftsData}
            assignments={assignmentsData}
            availabilities={availabilitiesData}
            currentUser={userProfile}
        />
    );
}
