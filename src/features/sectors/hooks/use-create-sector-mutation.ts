import { createSectorMutationOptions } from '@/features/sectors/queries';
import { useMutation } from '@tanstack/react-query';

export default function useCreateSectorMutation() {
  return useMutation(createSectorMutationOptions());
}
