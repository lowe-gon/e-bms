import type { TUpdateAccountFormSchema } from '@/features/accounts/schemas/account-form.schema';
import { updateUser } from '@/features/users/api/update-user.api';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';

type TMutationVariables = {
  schema: TUpdateAccountFormSchema;
  userId: string;
};

export function useUpdateUserMutation() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async (variables: TMutationVariables) =>
      await updateUser(variables.schema, variables.userId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      }),
  });
}
