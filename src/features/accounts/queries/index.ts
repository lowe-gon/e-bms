import { deleteUser } from '@/features/accounts/api/delete-user-account';
import { getUsers } from '@/features/accounts/api/get-users';
import { upsertUserAccount } from '@/features/accounts/api/upsert-user-account';
import type { EditUserSchemaProps } from '@/features/accounts/schema/edit-user.schema';
import type { NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import { getQueryClient } from '@/lib/query-client';
import type { Users } from '@/typings';
import { infiniteQueryOptions, type UseMutationOptions } from '@tanstack/react-query';

type UpsertMutationVariables =
  | { mode: 'create'; data: NewUserSchemaProps }
  | { mode: 'edit'; data: EditUserSchemaProps; userId: string };

export function upertUserAccountMutationOptions(): UseMutationOptions<
  Users,
  Error,
  UpsertMutationVariables
> {
  const queryClient = getQueryClient();
  return {
    mutationKey: ['users'],
    mutationFn: async (variables) => {
      if (variables.mode === 'create') {
        return upsertUserAccount({ mode: 'create', data: variables.data });
      } else {
        return upsertUserAccount({ mode: 'edit', data: variables.data, userId: variables.userId });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  };
}

export function getUsersInfiniteQueryOptions() {
  return infiniteQueryOptions({
    queryKey: ['users'],
    queryFn: ({ pageParam }) =>
      getUsers({
        limit: 10,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.metadata || { page: 1, totalPages: 1 };
      return page < (totalPages ?? 1) ? page + 1 : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const { page } = firstPage.metadata || { page: 1 };
      return page > 1 ? page - 1 : undefined;
    },
    maxPages: 3,
  });
}

export function deleteUserAccountMutationOptions() {
  const queryClient = getQueryClient();
  return {
    mutationKey: ['users'],
    mutationFn: async (userId: string) => await deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  };
}
