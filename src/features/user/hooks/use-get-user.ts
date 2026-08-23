import { getUserQueryOptions } from '@/features/user/queries/user-queries';
import { useQuery } from '@tanstack/react-query';

export default function useGetUserQuery() {
  return useQuery(getUserQueryOptions());
}
