import { catchFetch } from '@/lib/try-catch';
import { Database } from '@/typings/database.types';
import { ResponseData } from '@/typings/index.types';

type Users = Database['public']['Tables']['users']['Row'];

export async function getUser(): Promise<Users | null> {
  const [data, error] = await catchFetch<ResponseData<Users>>('/api/users', {
    method: 'GET',
  });

  if (error) return null;

  return data.data;
}
