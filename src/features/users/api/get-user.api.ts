import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';

export async function getUser(signal: AbortSignal) {
  const [data, error] = await fetcher<TUserWithSector>('/api/users/me', { method: 'GET', signal });

  if (error) {
    throw error;
  }

  return data;
}
