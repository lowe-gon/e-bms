import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse, ResponseMetadata } from '@/typings/api.types';

type TGetUsers = ResponseMetadata & {
  searchQuery: string;
  signal: AbortSignal;
};

export async function getUsers({ limit, page, searchQuery, signal, sortBy, sortOrder }: TGetUsers) {
  const [data, error] = await fetcher<ApiResponse<TUserWithSector[]>>(
    `/api/users/account?search=${searchQuery}&lpage=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}`,
    {
      method: 'GET',
      signal,
    },
  );

  if (error) {
    throw error;
  }

  return data;
}
