import { getUser } from '@/features/user/api/get-user';
import { queryOptions } from '@tanstack/react-query';

export function getUserQueryOptions() {
  return queryOptions({
    queryKey: ['users', 'me'],
    queryFn: getUser,
  });
}
