import { getAllUsersQueryOptions } from '@/features/user/queries';
import type { ResponseMetadata } from '@/typings';
import { useQuery } from '@tanstack/react-query';

export default function useGetAllUsersQueryOptions({
  searchQuery = '',
  sortOrder = 'asc',
  sortBy = 'created_at',
  limit = 10,
  page = 1,
}: ResponseMetadata) {
  return useQuery(
    getAllUsersQueryOptions({
      searchQuery,
      sortBy,
      sortOrder,
      limit,
      page,
    }),
  );
}
