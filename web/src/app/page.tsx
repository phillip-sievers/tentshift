import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles, tents } from "@/db/schema";
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

    return (
        <DashboardWrapper
            headerProps={{
                tentId: tent.id,
                tentName: tent.name,
                tentImage: tent.imageUrl,
                userAvatar: userProfile.avatarUrl,
                userName: userProfile.fullName,
            }}
        />
    );
}
