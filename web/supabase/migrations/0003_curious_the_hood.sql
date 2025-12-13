CREATE TYPE "public"."availability_status" AS ENUM('available', 'maybe', 'unavailable');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Captain', 'Member');--> statement-breakpoint
CREATE TYPE "public"."tent_type" AS ENUM('Black', 'Blue', 'White');--> statement-breakpoint
ALTER TABLE "shifts" DROP CONSTRAINT "shifts_tent_id_tents_id_fk";
--> statement-breakpoint
ALTER TABLE "availabilities" ALTER COLUMN "status" SET DATA TYPE "public"."availability_status" USING "status"::"public"."availability_status";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'Member'::"public"."role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET DATA TYPE "public"."role" USING "role"::"public"."role";--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "role" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" ALTER COLUMN "is_grace" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tents" ALTER COLUMN "tent_type" SET DEFAULT 'Black'::"public"."tent_type";--> statement-breakpoint
ALTER TABLE "tents" ALTER COLUMN "tent_type" SET DATA TYPE "public"."tent_type" USING "tent_type"::"public"."tent_type";--> statement-breakpoint
ALTER TABLE "tents" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "assignments" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "availabilities" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "tents" ADD COLUMN "created_by" uuid;--> statement-breakpoint
ALTER TABLE "tents" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tent_id_tents_id_fk" FOREIGN KEY ("tent_id") REFERENCES "public"."tents"("id") ON DELETE cascade ON UPDATE no action;