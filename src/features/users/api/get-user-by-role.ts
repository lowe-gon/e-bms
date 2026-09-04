import type { UserRole } from '@/constants/user-role';
import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse, ResponseMetadata } from '@/typings/api.types';

type TGetCouncilors = ResponseMetadata & {
  searchQuery: string;
  role: UserRole;
  signal: AbortSignal;
};

export async function getUserByRole({
  signal,
  limit,
  page,
  searchQuery,
  role,
  sortOrder,
}: TGetCouncilors) {
  const params = new URLSearchParams({
    search: searchQuery,
    role: role ?? 'captain',
    page: String(page),
    limit: String(limit),
    sortOrder: sortOrder ?? 'desc',
  });

  const [data, error] = await fetcher<ApiResponse<TUserWithSector[]>>(
    `/api/users/get-by-role?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal,
    },
  );

  if (error) {
    throw error;
  }

  return data;
}
