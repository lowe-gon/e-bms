import { deleteUser } from '@/features/accounts/api/delete-user-account';
import { getUsers } from '@/features/accounts/api/get-users';
import { upsertUserAccount } from '@/features/accounts/api/upsert-user-account';
import type { EditUserSchemaProps } from '@/features/accounts/schema/edit-user.schema';
import type { NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import { getQueryClient } from '@/lib/query-client';
import type { ResponseMetadata, Users } from '@/typings';
import { queryOptions, type UseMutationOptions } from '@tanstack/react-query';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'active' }),
  };
}

export function getUsersQueryOptions({
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

export function deleteUserAccountMutationOptions() {
  const queryClient = getQueryClient();
  return {
    mutationKey: ['users'],
    mutationFn: async (userId: string) => await deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'active' }),
  };
}
