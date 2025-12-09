"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { availabilities, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateAvailability(
    startTime: Date,
    endTime: Date,
    status: "available" | "maybe" | "unavailable"
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const userProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id),
    });

    if (!userProfile || !userProfile.tentId) {
        throw new Error("No tent found");
    }

    // Insert the new availability range
    // TODO: Handle overlapping ranges cleanup for cleaner DB
    await db.insert(availabilities).values({
        userId: user.id,
        tentId: userProfile.tentId,
        startTime,
        endTime,
        status,
    });

    revalidatePath("/dashboard/availability");
}
