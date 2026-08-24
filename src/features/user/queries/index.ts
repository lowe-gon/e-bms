import { getUser } from '@/features/user/api/get-user';
import type { Users } from '@/typings';
import { queryOptions } from '@tanstack/react-query';

export function getUserQueryOptions() {
  return queryOptions({
    queryKey: ['users', 'me'],
    queryFn: async () => {
      const user = await getUser();
      return user as Users;
    },
  });
}
