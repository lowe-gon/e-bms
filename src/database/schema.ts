import { sql } from 'drizzle-orm';
import { pgEnum, pgPolicy, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';

export const roleEnum = pgEnum('role', ['captain', 'secretary', 'councilor', 'treasurer']);

const isAuthenticated = sql`(select auth.jwt() ->> 'sub') = (clerk_id)::text`;
const isCheckUserTableAuthenticated = sql`exists (
  select 1 from public.users where users.clerk_id = (select auth.jwt() ->> 'sub')
)`;

// 1. Users Table
export const userTable = pgTable.withRLS(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    clerk_id: text('clerk_id').unique().notNull(),
    avatar_url: text('avatar_url').default('').notNull(),
    sector_id: uuid('sector_id').references(() => sectorTable.id, { onDelete: 'set null' }),
    first_name: text('first_name').default('').notNull(),
    last_name: text('last_name').default('').notNull(),
    email_address: text('email_address').unique(),
    username: text('username').unique(),
    phone_number: text('phone_number').default('').notNull(),
    last_sign_in_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow(),
    role: roleEnum('role').default('captain').notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
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

// 2. Sectors Table
export const sectorTable = pgTable.withRLS(
  'sectors',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: text('name').unique().default('').notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
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

// 3. Puroks Table
export const purokTable = pgTable.withRLS(
  'puroks',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    name: text('name').unique().notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  () => [
    pgPolicy('Purok Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Purok Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Purok Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Purok Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);

// 4. Sector to Purok Junction Table
export const sectorToPurokTable = pgTable.withRLS(
  'sector_to_puroks',
  {
    sector_id: uuid('sector_id')
      .notNull()
      .references(() => sectorTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    purok_id: uuid('purok_id')
      .notNull()
      .references(() => purokTable.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.sector_id, t.purok_id] }),
    pgPolicy('SectorToPurok Insert Policy', {
      for: 'insert',
      to: authenticatedRole,
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('SectorToPurok Select Policy', {
      for: 'select',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('SectorToPurok Update Policy', {
      for: 'update',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('SectorToPurok Delete Policy', {
      for: 'delete',
      to: authenticatedRole,
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);
