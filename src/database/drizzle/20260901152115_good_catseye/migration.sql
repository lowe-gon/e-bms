CREATE TYPE "account_status" AS ENUM('Active', 'InActive', 'On Leave');--> statement-breakpoint
CREATE TYPE "announcement_category" AS ENUM('Public Advisory', 'Emergency / Weather Alert', 'Executive Order', 'Medical Mission', 'SK Youth Event');--> statement-breakpoint
CREATE TYPE "blotter_status" AS ENUM('Pending Lupon Hearing', 'Amicably Settled', 'Cert. to File Action Issued', 'Dismissed');--> statement-breakpoint
CREATE TYPE "civil_status" AS ENUM('Single', 'Married', 'Widowed', 'Separated');--> statement-breakpoint
CREATE TYPE "committee_role" AS ENUM('Member', 'Vice Chairperson', 'Committee Secretary');--> statement-breakpoint
CREATE TYPE "document_status" AS ENUM('Pending Review', 'Approved', 'Released / Printed', 'Rejected');--> statement-breakpoint
CREATE TYPE "document_type" AS ENUM('Barangay Clearance', 'Certificate of Indigency', 'Certificate of Residency', 'First Time Job Seeker Clearance (RA 11261)', 'Barangay Business Clearance', 'Barangay Blotter Certificate');--> statement-breakpoint
CREATE TYPE "education" AS ENUM('Elementary', 'High School', 'College', 'Vocational', 'Post-Graduate');--> statement-breakpoint
CREATE TYPE "gender" AS ENUM('Male', 'Female');--> statement-breakpoint
CREATE TYPE "meeting_status" AS ENUM('Pending Captain Approval', 'Scheduled', 'In Progress', 'Adjourned', 'Cancelled');--> statement-breakpoint
CREATE TYPE "meeting_type" AS ENUM('Regular Session', 'Special Session', 'Barangay Assembly', 'Committee Hearing');--> statement-breakpoint
CREATE TYPE "payment_method" AS ENUM('Cash', 'GCash / Electronic', 'Bank Transfer');--> statement-breakpoint
CREATE TYPE "payment_status" AS ENUM('Paid', 'Pending Payment', 'Waived (Exempt)');--> statement-breakpoint
CREATE TYPE "project_status" AS ENUM('Planning', 'Ongoing', 'Completed', 'On Hold');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('captain', 'secretary', 'councilor', 'treasurer', 'staff', 'tanod');--> statement-breakpoint
CREATE TYPE "voter_status" AS ENUM('Registered Voter', 'Non-Voter');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"title" text NOT NULL,
	"category" "announcement_category" NOT NULL,
	"content" text NOT NULL,
	"date_posted" timestamp with time zone NOT NULL,
	"posted_by_id" uuid NOT NULL,
	"target_audience" text DEFAULT 'All Residents' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "announcements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "budget_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"year" timestamp NOT NULL,
	"name" text NOT NULL,
	"allocated_amount" numeric(14,2) NOT NULL,
	"spent_amount" numeric(14,2) DEFAULT '0.00' NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "budget_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "committee_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"committee_id" uuid NOT NULL,
	"name" text NOT NULL,
	"role" "committee_role" DEFAULT 'Member'::"committee_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "committee_members" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "committee_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"committee_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"budget_allocated" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"budget_spent" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"status" "project_status" DEFAULT 'Planning'::"project_status" NOT NULL,
	"target_beneficiaries" text NOT NULL,
	"metric_label" text,
	"metric_target" integer DEFAULT 0,
	"metric_current" integer DEFAULT 0,
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "committee_projects" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "committees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"assigned_councilor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"mandated_fund_name" text NOT NULL,
	"demographic_focus" text NOT NULL,
	"allocated_budget" numeric(12,2) DEFAULT '0.00' NOT NULL,
	"sample_aid_services" jsonb DEFAULT '[]',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "committees" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "disbursement_vouchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"voucher_no" text NOT NULL UNIQUE,
	"or_no" text,
	"prepared_by_id" uuid NOT NULL,
	"approved_by_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"payee" text NOT NULL,
	"explation" text NOT NULL,
	"amount" numeric(14,2) NOT NULL,
	"fund_source" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "disbursement_vouchers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "document_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"control_no" text NOT NULL UNIQUE,
	"or_no" text,
	"resident_id" uuid NOT NULL,
	"document_type" "document_type" NOT NULL,
	"purpose" text NOT NULL,
	"request_date" timestamp with time zone NOT NULL,
	"status" "document_status" DEFAULT 'Pending Review'::"document_status" NOT NULL,
	"fee" numeric(10,2) DEFAULT '0.00' NOT NULL,
	"is_fee_exempt" boolean DEFAULT false NOT NULL,
	"issued_date" timestamp with time zone,
	"approved_by_id" uuid NOT NULL,
	"remarks" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"household_number" text NOT NULL UNIQUE,
	"sector_id" uuid NOT NULL,
	"purok" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "households" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "official_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"or_no" text NOT NULL UNIQUE,
	"payor_id" uuid NOT NULL,
	"issued_by_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"nature_of_collection" text NOT NULL,
	"amount" numeric(14,2) NOT NULL,
	"payment_method" "payment_method" DEFAULT 'Cash'::"payment_method" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "official_receipts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "residents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() UNIQUE,
	"household_id" uuid NOT NULL,
	"first_name" text NOT NULL,
	"middle_name" text NOT NULL,
	"last_name" text NOT NULL,
	"suffix" text DEFAULT '' NOT NULL,
	"gender" "gender" NOT NULL,
	"birth_date" timestamp NOT NULL,
	"household_role" text DEFAULT 'Member' NOT NULL,
	"is_household_head" boolean DEFAULT false NOT NULL,
	"contact_number" text NOT NULL,
	"occupation" text NOT NULL,
	"voter_status" "voter_status" DEFAULT 'Non-Voter'::"voter_status" NOT NULL,
	"precinct_number" text,
	"national_text" text,
	"philhealth_id" text,
	"is_senior" boolean DEFAULT false NOT NULL,
	"is_pwd" boolean DEFAULT false NOT NULL,
	"is_solo_parent" boolean DEFAULT false NOT NULL,
	"is_4ps" boolean DEFAULT false NOT NULL,
	"is_youth" boolean DEFAULT false NOT NULL,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "residents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"code" text NOT NULL,
	"assigned_councilor_id" uuid NOT NULL,
	"name" text DEFAULT '' NOT NULL UNIQUE,
	"purok_coverage" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sectors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"clerk_id" text NOT NULL UNIQUE,
	"avatar_url" text DEFAULT '' NOT NULL,
	"first_name" text DEFAULT '' NOT NULL,
	"last_name" text DEFAULT '' NOT NULL,
	"email_address" text UNIQUE,
	"username" text UNIQUE,
	"phone_number" text DEFAULT '' NOT NULL,
	"last_sign_in_at" timestamp with time zone DEFAULT now(),
	"role" "user_role" DEFAULT 'captain'::"user_role" NOT NULL,
	"status" "account_status" DEFAULT 'Active'::"account_status",
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_posted_by_id_users_id_fkey" FOREIGN KEY ("posted_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committee_id_committees_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id");--> statement-breakpoint
ALTER TABLE "committee_projects" ADD CONSTRAINT "committee_projects_committee_id_committees_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committees"("id");--> statement-breakpoint
ALTER TABLE "committees" ADD CONSTRAINT "committees_assigned_councilor_id_users_id_fkey" FOREIGN KEY ("assigned_councilor_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "disbursement_vouchers" ADD CONSTRAINT "disbursement_vouchers_prepared_by_id_users_id_fkey" FOREIGN KEY ("prepared_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "disbursement_vouchers" ADD CONSTRAINT "disbursement_vouchers_approved_by_id_users_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_resident_id_residents_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id");--> statement-breakpoint
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_approved_by_id_users_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "households" ADD CONSTRAINT "households_sector_id_sectors_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "sectors"("id");--> statement-breakpoint
ALTER TABLE "official_receipts" ADD CONSTRAINT "official_receipts_payor_id_residents_id_fkey" FOREIGN KEY ("payor_id") REFERENCES "residents"("id");--> statement-breakpoint
ALTER TABLE "official_receipts" ADD CONSTRAINT "official_receipts_issued_by_id_users_id_fkey" FOREIGN KEY ("issued_by_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "residents" ADD CONSTRAINT "residents_household_id_households_id_fkey" FOREIGN KEY ("household_id") REFERENCES "households"("id");--> statement-breakpoint
ALTER TABLE "sectors" ADD CONSTRAINT "sectors_assigned_councilor_id_users_id_fkey" FOREIGN KEY ("assigned_councilor_id") REFERENCES "users"("id");--> statement-breakpoint
CREATE POLICY "Announcement Insert Policy" ON "announcements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Announcement Select Policy" ON "announcements" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Announcement Update Policy" ON "announcements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Announcement Delete Policy" ON "announcements" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Insert Policy" ON "budget_items" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Select Policy" ON "budget_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Update Policy" ON "budget_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Delete Policy" ON "budget_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Member Insert Policy" ON "committee_members" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Member Select Policy" ON "committee_members" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Member Update Policy" ON "committee_members" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Member Delete Policy" ON "committee_members" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Project Insert Policy" ON "committee_projects" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Project Select Policy" ON "committee_projects" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Project Update Policy" ON "committee_projects" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Project Delete Policy" ON "committee_projects" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Insert Policy" ON "committees" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Select Policy" ON "committees" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Update Policy" ON "committees" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Committee Delete Policy" ON "committees" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Insert Policy" ON "disbursement_vouchers" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Select Policy" ON "disbursement_vouchers" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Update Policy" ON "disbursement_vouchers" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Budget Item Delete Policy" ON "disbursement_vouchers" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Document Request Insert Policy" ON "document_requests" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Document Request Select Policy" ON "document_requests" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Document Request Update Policy" ON "document_requests" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Document Request Delete Policy" ON "document_requests" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Households Insert Policy" ON "households" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Households Select Policy" ON "households" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Households Update Policy" ON "households" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Households Delete Policy" ON "households" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Official Receipt Insert Policy" ON "official_receipts" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Official Receipt Select Policy" ON "official_receipts" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Official Receipt Update Policy" ON "official_receipts" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Official Receipt Delete Policy" ON "official_receipts" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Resident Insert Policy" ON "residents" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Resident Select Policy" ON "residents" AS PERMISSIVE FOR SELECT TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Resident Update Policy" ON "residents" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)) WITH CHECK (exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
));--> statement-breakpoint
CREATE POLICY "Resident Delete Policy" ON "residents" AS PERMISSIVE FOR DELETE TO "authenticated" USING (exists (
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
CREATE POLICY "User Insert Policy" ON "users" AS PERMISSIVE FOR INSERT TO "service_role" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "User Select Policy" ON "users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Update Policy" ON "users" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text) WITH CHECK ((select auth.jwt() ->> 'sub') = (clerk_id)::text);--> statement-breakpoint
CREATE POLICY "User Delete Policy" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.jwt() ->> 'sub') = (clerk_id)::text);