DROP TYPE IF EXISTS "role" CASCADE;
CREATE TYPE "role" AS ENUM('captain', 'secretary', 'councilor', 'treasurer');--> statement-breakpoint
CREATE TABLE "puroks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "puroks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text DEFAULT '' NOT NULL UNIQUE,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sectors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sector_to_puroks" (
	"sector_id" uuid,
	"purok_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sector_to_puroks_pkey" PRIMARY KEY("sector_id","purok_id")
);
--> statement-breakpoint
ALTER TABLE "sector_to_puroks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_id" text NOT NULL UNIQUE,
	"avatar_url" text DEFAULT '' NOT NULL,
	"sector_id" uuid,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"email_address" text UNIQUE,
	"username" text UNIQUE,
	"phone_number" text DEFAULT '' NOT NULL,
	"last_sign_in_at" timestamp with time zone DEFAULT now(),
	"role" "role" DEFAULT 'captain'::"role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sector_to_puroks" ADD CONSTRAINT "sector_to_puroks_sector_id_sectors_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "sector_to_puroks" ADD CONSTRAINT "sector_to_puroks_purok_id_puroks_id_fkey" FOREIGN KEY ("purok_id") REFERENCES "puroks"("id") ON DELETE CASCADE ON UPDATE CASCADE;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_sector_id_sectors_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id");--> statement-breakpoint
CREATE POLICY "Purok Insert Policy" ON "puroks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Purok Select Policy" ON "puroks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Purok Update Policy" ON "puroks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Purok Delete Policy" ON "puroks" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Sector Insert Policy" ON "sectors" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Sector Select Policy" ON "sectors" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Sector Update Policy" ON "sectors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Sector Delete Policy" ON "sectors" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "SectorToPurok Insert Policy" ON "sector_to_puroks" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "SectorToPurok Select Policy" ON "sector_to_puroks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "SectorToPurok Update Policy" ON "sector_to_puroks" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "SectorToPurok Delete Policy" ON "sector_to_puroks" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "User Insert Policy" ON "users" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "User Select Policy" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Update Policy" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text) WITH CHECK ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Delete Policy" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);