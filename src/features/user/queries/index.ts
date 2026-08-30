import { getUser } from '@/features/user/api/get-user';
import type { ResponseMetadata, Users } from '@/typings';
import { queryOptions } from '@tanstack/react-query';
import { getUsers } from '../api/get-users';

export function getUserQueryOptions() {
  return queryOptions({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const user = await getUser();
      return user as Users;
    },
  });
}

export function getAllUsersQueryOptions({
  searchQuery,
  sortBy,
  sortOrder,
  limit,
  page,
}: ResponseMetadata) {
  return queryOptions({
    queryKey: [
      'users',
      {
        searchQuery,
        sortBy,
        sortOrder,
        limit,
        page,
      },
    ],
    queryFn: () =>
      getUsers({
        limit: limit,
        page: page,
        searchQuery: searchQuery ?? '',
        sortBy: sortBy ?? '',
        sortOrder: sortOrder ?? 'asc',
      }),
    placeholderData: (previousData) => previousData,
  });
}
