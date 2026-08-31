import { catchFetch } from '@/lib/try-catch';
import { type ResponseData, type ResponseMetadata, type UserRole, type Users } from '@/typings';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

async function getUserByRoleApi(role: UserRole) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(
    `/api/users/getByRole?role=${role}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (error) throw error;

  return data;
}

export default function useGetUserByRoleQuery(role: UserRole = 'captain') {
  return useQuery({
    queryKey: ['users', role],
    queryFn: async () => getUserByRoleApi(role),
    placeholderData: keepPreviousData,
  });
}

async function getAllUsersApi({ searchQuery, page, limit, sortBy, sortOrder }: ResponseMetadata) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(
    `/api/users/getAll?search=${searchQuery}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (error) throw error;

  return data;
}

export function useGetAllUsersQuery({
  searchQuery = '',
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: ResponseMetadata) {
  return useQuery({
    queryKey: [
      'users',
      {
        searchQuery,
        page,
        limit,
        sortBy,
        sortOrder,
      },
    ],
    queryFn: async () => getAllUsersApi({ page, searchQuery, limit, sortBy, sortOrder }),
    placeholderData: keepPreviousData,
  });
}
