import { deleteUser } from '@/features/users/api/delete-user.api';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';

export function useDeleteUserMution() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async (userId: string) => await deleteUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['users'],
        refetchType: 'active',
      }),
  });
}
