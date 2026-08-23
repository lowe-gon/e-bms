import { Database } from '@/typings/database.types';
import { ENV } from '@/typings/env';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export function createServerSupabaseClient() {
  return createClient<Database>(
    ENV.NEXT_PUBLIC_SUPABASE_URL!,
    ENV.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    },
  );
}
