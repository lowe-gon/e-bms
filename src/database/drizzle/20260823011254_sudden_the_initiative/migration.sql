CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"code" text DEFAULT '' NOT NULL UNIQUE,
	"name" text DEFAULT '' NOT NULL UNIQUE,
	"purok" text[] NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sectors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "sector_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
DROP TYPE "role";--> statement-breakpoint
CREATE TYPE "role" AS ENUM('captain', 'secretary', 'councilor', 'treasurer');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "role" USING "role"::"role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'captain'::"role";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_sector_id_sectors_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id");--> statement-breakpoint
CREATE POLICY "Sector Insert Policy" ON "sectors" AS PERMISSIVE FOR INSERT TO public WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
));--> statement-breakpoint
CREATE POLICY "Sector Select Policy" ON "sectors" AS PERMISSIVE FOR SELECT TO public USING (exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
));--> statement-breakpoint
CREATE POLICY "Sector Update Policy" ON "sectors" AS PERMISSIVE FOR UPDATE TO public USING (exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
));--> statement-breakpoint
CREATE POLICY "Sector Delete Policy" ON "sectors" AS PERMISSIVE FOR DELETE TO public USING (exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
));