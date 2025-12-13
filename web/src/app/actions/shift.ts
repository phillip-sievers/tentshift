"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { shifts, assignments, profiles } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function getMemberShifts(userId: string) {
    const userAssignments = await db.query.assignments.findMany({
        where: eq(assignments.userId, userId),
        with: {
            shift: true,
        },
    });

    return userAssignments.map((a) => a.shift);
}

export async function getTentShifts(tentId: string) {
    const tentShifts = await db.query.shifts.findMany({
        where: eq(shifts.tentId, tentId),
        with: {
            assignments: {
                with: {
                    user: true,
                },
            },
        },
    });

    return tentShifts;
}
