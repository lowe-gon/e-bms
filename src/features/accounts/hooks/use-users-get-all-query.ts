import { getUsersInfiniteQueryOptions } from '@/features/accounts/queries';
import { useInfiniteQuery } from '@tanstack/react-query';

export default function useGetUsersGetAllQuery() {
  return useInfiniteQuery(getUsersInfiniteQueryOptions());
}
