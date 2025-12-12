"use server";

import { db } from "@/db";
import { tents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateTentName(tentId: string, newName: string) {
    try {
        await db
            .update(tents)
            .set({ name: newName })
            .where(eq(tents.id, tentId));
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update tent name:", error);
        return { success: false, error: "Failed to update tent name" };
    }
}

export async function updateTentImage(tentId: string, imageUrl: string) {
    try {
        await db.update(tents).set({ imageUrl }).where(eq(tents.id, tentId));
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to update tent image:", error);
        return { success: false, error: "Failed to update tent image" };
    }
}
