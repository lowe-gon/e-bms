CREATE TYPE "role" AS ENUM('captain', 'secretary', 'council', 'treasurer');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"clerk_id" text NOT NULL,
	"avatar_url" text DEFAULT '' NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"phone_number" text DEFAULT '' NOT NULL,
	"role" "role" DEFAULT 'captain'::"role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "User Insert Policy" ON "users" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "User Select Policy" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Update Policy" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text) WITH CHECK ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Delete Policy" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);