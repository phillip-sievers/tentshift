CREATE TABLE "availabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tent_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_tent_id_tents_id_fk" FOREIGN KEY ("tent_id") REFERENCES "public"."tents"("id") ON DELETE cascade ON UPDATE no action;