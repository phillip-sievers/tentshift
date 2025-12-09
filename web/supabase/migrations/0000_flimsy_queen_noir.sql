CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shift_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"full_name" text,
	"avatar_url" text,
	"tent_id" uuid,
	"role" text DEFAULT 'Member'
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tent_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"required_count" integer DEFAULT 2 NOT NULL,
	"is_grace" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "tents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"join_code" text NOT NULL,
	"tent_type" text DEFAULT 'Black' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "tents_join_code_unique" UNIQUE("join_code")
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_tent_id_tents_id_fk" FOREIGN KEY ("tent_id") REFERENCES "public"."tents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_tent_id_tents_id_fk" FOREIGN KEY ("tent_id") REFERENCES "public"."tents"("id") ON DELETE no action ON UPDATE no action;