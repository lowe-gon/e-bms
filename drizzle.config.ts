import { ENV } from '@/typings/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/database/drizzle',
  schema: './src/database/schema.ts',

  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL!,
  },

  schemaFilter: ['public'],
});
