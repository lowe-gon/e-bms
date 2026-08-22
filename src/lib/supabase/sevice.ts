import { ENV } from '@/typings/env';
import { createClient } from '@supabase/supabase-js';

export function createServiceSupabaseClient() {
  return createClient(ENV.NEXT_PUBLIC_SUPABASE_URL!, ENV.SUPABASE_SERVICE_ROLE!, {
    auth: {
      persistSession: false,
    },
  });
}
