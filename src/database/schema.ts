import { sql } from 'drizzle-orm';
import { pgEnum, pgPolicy, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authenticatedRole, serviceRole } from 'drizzle-orm/supabase';

export const roleEnum = pgEnum('role', ['captain', 'secretary', 'council', 'treasurer']);

const isAuthenticated = sql`(select auth.jwt() ->> 'sub') = (clerk_id)::text`;

export const userTable = pgTable.withRLS(
  'users',
  {
    id: uuid().defaultRandom().primaryKey().unique().notNull(),
    clerk_id: text().unique().notNull(),
    avatar_url: text().default('').notNull(),
    first_name: text().default('').notNull(),
    last_name: text().default('').notNull(),
    phone_number: text().default('').notNull(),
    role: roleEnum().default('captain').notNull(),
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
