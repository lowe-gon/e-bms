import { sql } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgPolicy,
  pgSequence,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';

const isAuthenticated = sql`(select auth.jwt() ->> 'sub') = (clerk_id)::text`;
const isCheckUserTableAuthenticated = sql`exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)`;

// Increment Sector Code
export const sectorCodeSeq = pgSequence('sector_code_seq');

// Enums
export const userRoleEnum = pgEnum('user_role', [
  'captain',
  'secretary',
  'councilor',
  'treasurer',
  'staff',
  'tanod',
]);

export const accountStatusEnum = pgEnum('account_status', ['Active', 'InActive', 'On Leave']);

export const genderEnum = pgEnum('gender', ['Male', 'Female']);

export const civilStatusEnum = pgEnum('civil_status', [
  'Single',
  'Married',
  'Widowed',
  'Separated',
]);

export const voterStatusEnum = pgEnum('voter_status', ['Registered Voter', 'Non-Voter']);

export const educationEnum = pgEnum('education', [
  'Elementary',
  'High School',
  'College',
  'Vocational',
  'Post-Graduate',
]);

export const documentTypeEnum = pgEnum('document_type', [
  'Barangay Clearance',
  'Certificate of Indigency',
  'Certificate of Residency',
  'First Time Job Seeker Clearance (RA 11261)',
  'Barangay Business Clearance',
  'Barangay Blotter Certificate',
]);

export const documentStatusEnum = pgEnum('document_status', [
  'Pending Review',
  'Approved',
  'Released / Printed',
  'Rejected',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'Cash',
  'GCash / Electronic',
  'Bank Transfer',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'Paid',
  'Pending Payment',
  'Waived (Exempt)',
]);

export const meetingTypeEnum = pgEnum('meeting_type', [
  'Regular Session',
  'Special Session',
  'Barangay Assembly',
  'Committee Hearing',
]);

export const meetingStatusEnum = pgEnum('meeting_status', [
  'Pending Captain Approval',
  'Scheduled',
  'In Progress',
  'Adjourned',
  'Cancelled',
]);

export const blotterStatusEnum = pgEnum('blotter_status', [
  'Pending Lupon Hearing',
  'Amicably Settled',
  'Cert. to File Action Issued',
  'Dismissed',
]);

export const projectStatusEnum = pgEnum('project_status', [
  'Planning',
  'Ongoing',
  'Completed',
  'On Hold',
]);

export const committeeRoleEnum = pgEnum('committee_role', [
  'Member',
  'Vice Chairperson',
  'Committee Secretary',
]);

export const announcementCategoryEnum = pgEnum('announcement_category', [
  'Public Advisory',
  'Emergency / Weather Alert',
  'Executive Order',
  'Medical Mission',
  'SK Youth Event',
]);

// Users Table
export const userTable = pgTable.withRLS(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    clerkId: text('clerk_id').unique().notNull(),
    avatarUrl: text('avatar_url').default('').notNull(),
    firstName: text('first_name').default('').notNull(),
    lastName: text('last_name').default('').notNull(),
    emailAddress: text('email_address').unique(),
    username: text('username').unique(),
    phoneNumber: text('phone_number').default('').notNull(),
    lastSignInAt: timestamp('last_sign_in_at', { withTimezone: true, mode: 'string' }).defaultNow(),
    role: userRoleEnum('role').default('captain').notNull(),
    status: accountStatusEnum('status').default('Active'),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('User Insert Policy', {
      for: 'insert',
      to: serviceRole,
      as: 'permissive',
      withCheck: sql`true`,
    }),
    pgPolicy('User Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isAuthenticated,
    }),
    pgPolicy('User Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isAuthenticated,
      withCheck: isAuthenticated,
    }),
    pgPolicy('User Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isAuthenticated,
    }),
  ],
);

// Sectors Table
export const sectorTable = pgTable.withRLS(
  'sectors',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    code: text('code').notNull(),
    assignedCouncilorId: uuid('assigned_councilor_id')
      .notNull()
      .references(() => userTable.id),
    name: text('name').unique().default('').notNull(),
    purokCoverage: jsonb('purok_coverage').$type<string[]>().notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Sector Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Household Table
export const householdTable = pgTable.withRLS(
  'households',
  {
    id: uuid('id').primaryKey().defaultRandom().unique().notNull(),
    householdNumber: text('household_number').notNull().unique(),
    sectorId: uuid('sector_id')
      .notNull()
      .references(() => sectorTable.id),
    purok: text('purok').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Households Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Households Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Households Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Households Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Resident Table
export const residentTable = pgTable.withRLS(
  'residents',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    householdId: uuid('household_id')
      .notNull()
      .references(() => householdTable.id),
    firstName: text('first_name').notNull(),
    middleName: text('middle_name').notNull(),
    lastName: text('last_name').notNull(),
    suffix: text('suffix').notNull().default(''),
    gender: genderEnum('gender').notNull(),
    birthDate: timestamp('birth_date', { mode: 'string' }).notNull(),
    householdRole: text('household_role').notNull().default('Member'),
    isHouseholdHead: boolean('is_household_head').notNull().default(false),
    contactNumber: text('contact_number').notNull(),
    occupation: text('occupation').notNull(),
    voterStatus: voterStatusEnum('voter_status').notNull().default('Non-Voter'),
    precinctNumber: text('precinct_number'),
    nationalId: text('national_text'),
    philhealthId: text('philhealth_id'),
    isSenior: boolean('is_senior').notNull().default(false),
    isPwd: boolean('is_pwd').notNull().default(false),
    isSoloParent: boolean('is_solo_parent').notNull().default(false),
    is4ps: boolean('is_4ps').notNull().default(false),
    isYouth: boolean('is_youth').notNull().default(false),
    avatarUrl: text('avatar_url'),

    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Resident Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Resident Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Resident Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Resident Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Committee Table
export const committeeTable = pgTable.withRLS(
  'committees',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    assignedCouncilorId: uuid('assigned_councilor_id')
      .notNull()
      .references(() => userTable.id),
    name: text('name').notNull(),
    mandatedFundName: text('mandated_fund_name').notNull(),
    demographicFocus: text('demographic_focus').notNull(),
    allocatedBudget: numeric('allocated_budget', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    sampleAidServices: jsonb('sample_aid_services').$type<string[]>().default([]),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Committee Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Committee Member Table
export const committeeMemberTable = pgTable.withRLS(
  'committee_members',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    committeeId: uuid('committee_id')
      .notNull()
      .references(() => committeeTable.id),
    name: text('name').notNull(),
    role: committeeRoleEnum('role').default('Member').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Committee Member Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Member Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Member Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Member Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

export const committeeProjectTable = pgTable.withRLS(
  'committee_projects',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    committeeId: uuid('committee_id')
      .notNull()
      .references(() => committeeTable.id),
    title: text('name').notNull(),
    description: text('description').notNull(),
    budgetAllocated: numeric('budget_allocated', { precision: 12, scale: 2 })
      .notNull()
      .default('0.00'),
    budgetSpent: numeric('budget_spent', { precision: 12, scale: 2 }).notNull().default('0.00'),
    status: projectStatusEnum('status').notNull().default('Planning'),
    targetBeneficiaries: text('target_beneficiaries').notNull(),
    metricLabel: text('metric_label'),
    metricTarget: integer('metric_target').default(0),
    metricCurrent: integer('metric_current').default(0),
    startDate: timestamp('start_date', { withTimezone: true, mode: 'string' }).notNull(),
    endDate: timestamp('end_date', { withTimezone: true, mode: 'string' }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Committee Project Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Project Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Project Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Committee Project Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Budget Item Table
export const budgetItemTable = pgTable.withRLS(
  'budget_items',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    year: timestamp('year', { mode: 'string' }).notNull(),
    name: text('name').notNull(),
    allocatedAmount: numeric('allocated_amount', { precision: 14, scale: 2 }).notNull(),
    spentAmount: numeric('spent_amount', { precision: 14, scale: 2 }).notNull().default('0.00'),
    source: text('source').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Budget Item Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Disbursement Voucher Table
export const disbursementVoucherTable = pgTable.withRLS(
  'disbursement_vouchers',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    voucherNo: text('voucher_no').notNull().unique(),
    orNo: text('or_no'),
    preparedById: uuid('prepared_by_id')
      .notNull()
      .references(() => userTable.id),
    approvedById: uuid('approved_by_id')
      .notNull()
      .references(() => userTable.id),
    date: timestamp('date', { withTimezone: true, mode: 'string' }).notNull(),
    payee: text('payee').notNull(),
    explation: text('explation').notNull(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    fundSource: text('fund_source').notNull(),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Budget Item Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Budget Item Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Offial Receipt Table
export const officialReceiptTable = pgTable.withRLS(
  'official_receipts',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    orNo: text('or_no').notNull().unique(),
    payorId: uuid('payor_id')
      .notNull()
      .references(() => residentTable.id),
    issuedById: uuid('issued_by_id')
      .notNull()
      .references(() => userTable.id),
    date: timestamp('date', { withTimezone: true, mode: 'string' }).notNull(),
    natureOfCollection: text('nature_of_collection').notNull(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum('payment_method').notNull().default('Cash'),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Official Receipt Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Official Receipt Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Official Receipt Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Official Receipt Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Document Request Table
export const documentRequestTable = pgTable.withRLS(
  'document_requests',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    controlNo: text('control_no').notNull().unique(),
    orNo: text('or_no'),
    residentId: uuid('resident_id')
      .notNull()
      .references(() => residentTable.id),
    documentType: documentTypeEnum('document_type').notNull(),
    purpose: text('purpose').notNull(),
    requestDate: timestamp('request_date', { withTimezone: true, mode: 'string' }).notNull(),
    status: documentStatusEnum('status').notNull().default('Pending Review'),
    fee: numeric('fee', { precision: 10, scale: 2 }).notNull().default('0.00'),
    isFeeExempt: boolean('is_fee_exempt').notNull().default(false),
    issuedDate: timestamp('issued_date', { withTimezone: true, mode: 'string' }),
    approvedById: uuid('approved_by_id')
      .notNull()
      .references(() => userTable.id),
    remarks: text('remarks'),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Document Request Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Document Request Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Document Request Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Document Request Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// Document Request Table
export const announcementTable = pgTable.withRLS(
  'announcements',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    title: text('title').notNull(),
    category: announcementCategoryEnum('category').notNull(),
    content: text('content').notNull(),
    datePosted: timestamp('date_posted', { withTimezone: true, mode: 'string' }).notNull(),
    postedById: uuid('posted_by_id')
      .notNull()
      .references(() => userTable.id),
    targetAudience: text('target_audience').notNull().default('All Residents'),

    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Announcement Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Announcement Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Announcement Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Announcement Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);
