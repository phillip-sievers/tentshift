import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

// 1. Tents (The Groups)
export const tents = pgTable("tents", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    joinCode: text("join_code").notNull().unique(),
    tentType: text("tent_type").notNull().default("Black"),
    createdAt: timestamp("created_at").defaultNow(),
});

// 2. Profiles (The Users)
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    tentId: uuid("tent_id").references(() => tents.id),
    role: text("role").default("Member"),
});

// 3. Shifts
export const shifts = pgTable("shifts", {
    id: uuid("id").defaultRandom().primaryKey(),
    tentId: uuid("tent_id")
        .references(() => tents.id)
        .notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    requiredCount: integer("required_count").notNull().default(2),
    isGrace: boolean("is_grace").default(false),
});

// 4. Assignments
export const assignments = pgTable("assignments", {
    id: uuid("id").defaultRandom().primaryKey(),
    shiftId: uuid("shift_id")
        .references(() => shifts.id, { onDelete: "cascade" })
        .notNull(),
    userId: uuid("user_id")
        .references(() => profiles.id)
        .notNull(),
});
