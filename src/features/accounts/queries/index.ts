import { deleteUser } from '@/features/accounts/api/delete-user-account.api';
import { upsertUserAccount } from '@/features/accounts/api/upsert-user-account.api';
import type { EditUserSchemaProps } from '@/features/accounts/schema/edit-user.schema';
import type { NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import { getQueryClient } from '@/lib/query-client';
import type { Users } from '@/typings';
import { type UseMutationOptions } from '@tanstack/react-query';

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

export function deleteUserAccountMutationOptions() {
  const queryClient = getQueryClient();
  return {
    mutationKey: ['users'],
    mutationFn: async (userId: string) => await deleteUser(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'active' }),
  };
}
