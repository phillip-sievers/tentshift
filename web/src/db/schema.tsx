import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    integer,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["Captain", "Member"]);
export const tentTypeEnum = pgEnum("tent_type", ["Black", "Blue", "White"]);
export const availabilityStatusEnum = pgEnum("availability_status", [
    "available",
    "maybe",
    "unavailable",
]);

// 1. Tents (The Groups)
export const tents = pgTable("tents", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    joinCode: text("join_code").notNull().unique(),
    tentType: tentTypeEnum("tent_type").notNull().default("Black"),
    imageUrl: text("image_url"),
    createdBy: uuid("created_by"), // Circular reference handling might be tricky, usually solvable by separate alter or just loose FK if needed immediately
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tentsRelations = relations(tents, ({ one, many }) => ({
    creator: one(profiles, {
        fields: [tents.createdBy],
        references: [profiles.id],
    }),
    profiles: many(profiles),
    shifts: many(shifts),
}));

// 2. Profiles (The Users)
export const profiles = pgTable("profiles", {
    id: uuid("id").primaryKey(),
    fullName: text("full_name"),
    avatarUrl: text("avatar_url"),
    tentId: uuid("tent_id").references(() => tents.id),
    role: roleEnum("role").default("Member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    tent: one(tents, {
        fields: [profiles.tentId],
        references: [tents.id],
    }),
    assignments: many(assignments),
    availabilities: many(availabilities),
}));

// 3. Shifts
export const shifts = pgTable("shifts", {
    id: uuid("id").defaultRandom().primaryKey(),
    tentId: uuid("tent_id")
        .references(() => tents.id, { onDelete: "cascade" })
        .notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    requiredCount: integer("required_count").notNull().default(2),
    isGrace: boolean("is_grace").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const shiftsRelations = relations(shifts, ({ one, many }) => ({
    tent: one(tents, {
        fields: [shifts.tentId],
        references: [tents.id],
    }),
    assignments: many(assignments),
}));

// 4. Assignments
export const assignments = pgTable("assignments", {
    id: uuid("id").defaultRandom().primaryKey(),
    shiftId: uuid("shift_id")
        .references(() => shifts.id, { onDelete: "cascade" })
        .notNull(),
    userId: uuid("user_id")
        .references(() => profiles.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assignmentsRelations = relations(assignments, ({ one }) => ({
    shift: one(shifts, {
        fields: [assignments.shiftId],
        references: [shifts.id],
    }),
    user: one(profiles, {
        fields: [assignments.userId],
        references: [profiles.id],
    }),
}));

// 5. Availabilities
export const availabilities = pgTable("availabilities", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .references(() => profiles.id, { onDelete: "cascade" })
        .notNull(),
    tentId: uuid("tent_id")
        .references(() => tents.id, { onDelete: "cascade" })
        .notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    status: availabilityStatusEnum("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
    user: one(profiles, {
        fields: [availabilities.userId],
        references: [profiles.id],
    }),
    tent: one(tents, {
        fields: [availabilities.tentId],
        references: [tents.id],
    }),
}));
