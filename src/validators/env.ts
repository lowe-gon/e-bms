import * as z from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['production', 'development']),
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z
    .string()
    .min(
      1,
      'Clerk publishable key is missing. Please ensure NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set in your environment variables.',
    ),
  CLERK_SECRET_KEY: z
    .string()
    .min(
      1,
      'Clerk secret key is missing. Please ensure CLERK_SECRET_KEY is set in your environment variables.',
    ),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z
    .string()
    .min(
      1,
      'Clerk sign in url is missing. Please ensure NEXT_PUBLIC_CLERK_SIGN_IN_URL is set in your environment variables.',
    ),
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z
    .string()
    .min(
      1,
      'Clerk sign in redirect url is missing. Please ensure NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL is set in your environment variables.',
    ),
});

export const ENV = EnvSchema.parse(process.env);
