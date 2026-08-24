import { createUserAccount } from '@/features/accounts/api/create-account';
import { getQueryClient } from '@/lib/query-client';
import type { Users } from '@/typings';
import { type UseMutationOptions } from '@tanstack/react-query';
import type { NewUserSchemaProps } from '../schema/new-user.schema';

export function createUserMutationOptions(): UseMutationOptions<Users, Error, NewUserSchemaProps> {
  const queryClient = getQueryClient();
  return {
    mutationKey: ['users'],
    mutationFn: createUserAccount,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  };
}
