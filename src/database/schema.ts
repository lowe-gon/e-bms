import { sql } from 'drizzle-orm';
import { pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';

export const roleEnum = pgEnum('role', ['captain', 'secretary', 'councilor', 'treasurer']);

const isAuthenticated = sql`(select auth.jwt() ->> 'sub') = (clerk_id)::text`;
const isCheckUserTableAuthenticated = sql`exists (
  select 1 from public.users where users.clerk_id = auth.jwt() ->> 'sub'
)`;

export const userTable = pgTable.withRLS(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey().unique().notNull(),
    clerk_id: text('clerk_id').unique().notNull(),
    avatar_url: text('avatar_url').default('').notNull(),
    sector_id: uuid('sector_id').references(() => sectorTable.id),
    first_name: text('first_name').default('').notNull(),
    last_name: text('last_name').default('').notNull(),
    phone_number: text('phone_number').default('').notNull(),
    role: roleEnum('role').default('captain').notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdateFn(() => sql`now()`)
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

export const sectorTable = pgTable(
  'sectors',
  {
    id: uuid('id').defaultRandom().unique().primaryKey().notNull(),
    code: text('code').unique().default('').notNull(),
    name: text('name').unique().default('').notNull(),
    purok: text('purok').array().notNull(),
    created_at: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updated_at: timestamp({ withTimezone: true, mode: 'string' })
      .defaultNow()
      .$onUpdateFn(() => sql`now()`)
      .notNull(),
  },
  () => [
    pgPolicy('Sector Insert Policy', {
      for: 'insert',
      to: 'public',
      as: 'permissive',
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Select Policy', {
      for: 'select',
      to: 'public',
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Update Policy', {
      for: 'update',
      to: 'public',
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
      withCheck: isCheckUserTableAuthenticated,
    }),
    pgPolicy('Sector Delete Policy', {
      for: 'delete',
      to: 'public',
      as: 'permissive',
      using: isCheckUserTableAuthenticated,
    }),
  ],
);
