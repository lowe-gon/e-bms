import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';

export async function getUser(signal: AbortSignal) {
  const [data, error] = await fetcher<ApiResponse<TUserWithSector>>('/api/users/me', {
    method: 'GET',
    signal,
  });

  if (error) {
    throw error;
  }

  return data;
}
