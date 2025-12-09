"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { tents, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";

export async function createTent(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;

    if (!name || !type) {
        throw new Error("Name and Type are required");
    }

    // Generate a short join code
    const joinCode = nanoid(6).toUpperCase();

    // Transaction to create tent and update user profile
    // Note: Drizzle transaction support depends on the driver. Postgres.js supports it.

    // 1. Create Tent
    const [newTent] = await db
        .insert(tents)
        .values({
            name,
            tentType: type,
            joinCode,
        })
        .returning();

    // 2. Update Profile (Assign as Captain)
    // We upsert the profile in case it doesn't exist yet
    await db
        .insert(profiles)
        .values({
            id: user.id,
            tentId: newTent.id,
            role: "Captain",
            fullName: user.email, // Default to email if no name
        })
        .onConflictDoUpdate({
            target: profiles.id,
            set: {
                tentId: newTent.id,
                role: "Captain",
            },
        });

    redirect("/dashboard");
}

export async function joinTent(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const code = formData.get("code") as string;

    if (!code) {
        throw new Error("Join Code is required");
    }

    // Find tent by code
    const tent = await db.query.tents.findFirst({
        where: eq(tents.joinCode, code),
    });

    if (!tent) {
        throw new Error("Invalid Join Code");
    }

    // Update Profile (Assign as Member)
    await db
        .insert(profiles)
        .values({
            id: user.id,
            tentId: tent.id,
            role: "Member",
            fullName: user.email,
        })
        .onConflictDoUpdate({
            target: profiles.id,
            set: {
                tentId: tent.id,
                role: "Member",
            },
        });

    redirect("/dashboard");
}
