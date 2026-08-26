import { upertUserAccountMutationOptions } from '@/features/accounts/queries';
import { useMutation } from '@tanstack/react-query';

export default function useUpsertUserMutation() {
  return useMutation(upertUserAccountMutationOptions());
}
