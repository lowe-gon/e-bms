import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse, ResponseMetadata } from '@/typings/api.types';

type TGetUsers = ResponseMetadata & {
  searchQuery: string;
  role: string;
  signal: AbortSignal;
};

export async function getUsers({
  limit,
  page,
  searchQuery,
  role,
  signal,
  sortBy,
  sortOrder,
}: TGetUsers) {
  const params = new URLSearchParams({
    search: searchQuery,
    role: role ?? '',
    page: String(page),
    limit: String(limit),
    sortBy: sortBy ?? '',
    sortOrder: sortOrder ?? 'desc',
  });

  const [data, error] = await fetcher<ApiResponse<TUserWithSector[]>>(
    `/api/users/account?${params.toString()}`,
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
