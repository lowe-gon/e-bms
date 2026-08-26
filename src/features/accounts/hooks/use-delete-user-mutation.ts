import { deleteUserAccountMutationOptions } from '@/features/accounts/queries';
import { useMutation } from '@tanstack/react-query';

export default function useDeleteUserMutation() {
  return useMutation(deleteUserAccountMutationOptions());
}
