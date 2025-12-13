"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { tents, profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { nanoid } from "nanoid";
import { z } from "zod";

const CreateTentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(["Black", "Blue", "White"], {
        message: "Invalid tent type",
    }),
});

export async function createTent(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        name: formData.get("name"),
        type: formData.get("type"),
    };

    const validated = CreateTentSchema.safeParse(rawData);

    if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
    }

    const { name, type } = validated.data;

    // Generate a short join code
    const joinCode = nanoid(6).toUpperCase();

    // Use a transaction to ensure atomicity
    try {
        await db.transaction(async (tx) => {
            // 1. Create Tent
            const [newTent] = await tx
                .insert(tents)
                .values({
                    name,
                    tentType: type,
                    joinCode,
                    createdBy: user.id,
                })
                .returning();

            // 2. Update Profile (Assign as Captain)
            await tx
                .insert(profiles)
                .values({
                    id: user.id,
                    tentId: newTent.id,
                    role: "Captain",
                    fullName: user.email, // Default to email if no name, user can update later
                })
                .onConflictDoUpdate({
                    target: profiles.id,
                    set: {
                        tentId: newTent.id,
                        role: "Captain",
                    },
                });
        });
    } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to create tent. Please try again.");
    }

    redirect("/");
}

const JoinTentSchema = z.object({
    code: z.string().min(1, "Join Code is required"),
});

export async function joinTent(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const rawData = {
        code: formData.get("code"),
    };

    const validated = JoinTentSchema.safeParse(rawData);

    if (!validated.success) {
        throw new Error(validated.error.issues[0].message);
    }

    const { code } = validated.data;

    // Find tent by code
    const tent = await db.query.tents.findFirst({
        where: eq(tents.joinCode, code),
    });

    if (!tent) {
        throw new Error("Invalid Join Code");
    }

    // Use transaction for joining
    try {
        await db.transaction(async (tx) => {
            await tx
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
        });
    } catch (error) {
        console.error("Failed to join tent:", error);
        throw new Error("Failed to join tent");
    }

    redirect("/");
}
