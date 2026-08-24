import { createUserMutationOptions } from '@/features/accounts/queries';
import { useMutation } from '@tanstack/react-query';

export default function useCreateUserMutation() {
  return useMutation(createUserMutationOptions());
}
