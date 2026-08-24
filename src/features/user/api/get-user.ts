import { catchFetch } from '@/lib/try-catch';
import type { ResponseData } from '@/typings';
import type { Database } from '@/typings/database.types';

type Users = Database['public']['Tables']['users']['Row'];

export async function getUser(): Promise<Users | null> {
  const [data, error] = await catchFetch<ResponseData<Users>>('/api/users/me', {
    method: 'GET',
  });

  if (error) return null;

  return data.data;
}
