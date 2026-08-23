import 'dotenv/config';
import * as z from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string(),
  SUPABASE_SECRET_KEY: z.string(),
  DATABASE_URL: z.string(),
  SUPABASE_SERVICE_ROLE: z.string(),
  SUPABASE_PROJECT_ID: z.string(),
});

export const ENV = EnvSchema.parse(process.env);
