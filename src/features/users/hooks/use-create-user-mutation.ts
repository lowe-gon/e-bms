import { createUser } from '@/features/users/api/create-user.api';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';

export function useCreateUserMution() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: createUser,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      }),
  });
}
