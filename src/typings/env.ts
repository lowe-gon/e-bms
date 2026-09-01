import 'dotenv/config';
import * as z from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']).default('development'),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SIGNING_SECRET: z.string(),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string(),
  DATABASE_URL: z.string(),
});

export const ENV = EnvSchema.parse(process.env);
