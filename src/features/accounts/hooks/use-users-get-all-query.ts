import { getUsersQueryOptions } from '@/features/accounts/queries';
import type { ResponseMetadata } from '@/typings';
import { useQuery } from '@tanstack/react-query';

export default function useGetUsersGetAllQuery({
  searchQuery = '',
  sortOrder = 'asc',
  sortBy = 'created_at',
  limit = 10,
  page,
}: ResponseMetadata) {
  return useQuery(
    getUsersQueryOptions({
      searchQuery,
      sortBy,
      sortOrder,
      limit,
      page,
    }),
  );
}
