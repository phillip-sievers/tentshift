"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { availabilities, profiles } from "@/db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
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

    // Basic Validation
    if (startTime >= endTime) {
        throw new Error("Start time must be before end time");
    }

    // Overlap Check:
    // We want to remove any existing availabilities that are fully contained within the new range,
    // and adjust any that partially overlap.
    // For simplicity in this iteration, we will just delete any overlapping intervals and insert the new one.
    // A more advanced implementation would merge intervals, but "replace" is a safe user expectation for "I am available HERE".

    // Find overlapping intervals
    // Overlap condition: Not (EndA <= StartB or StartA >= EndB)
    // => EndA > StartB and StartA < EndB

    await db.transaction(async (tx) => {
        await tx.delete(availabilities).where(
            and(
                eq(availabilities.userId, user.id),
                // Overlap logic:
                // Existing Start < New End AND Existing End > New Start
                and(
                    // We can use generic sql or lte/gte.
                    // Let's use simpler logic: delete where overlap
                    gte(availabilities.endTime, startTime),
                    lte(availabilities.startTime, endTime)
                )
            )
        );

        // Insert the new availability range
        await tx.insert(availabilities).values({
            userId: user.id,
            tentId: userProfile.tentId!, // non-null assertion safe due to check above
            startTime,
            endTime,
            status,
        });
    });

    revalidatePath("/dashboard/availability");
}
