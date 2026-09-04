import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';
import { createSector } from '../api/create-sector';

export default function useCreateSectorMutation() {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['create-sector'],
    mutationFn: createSector,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['councilors'],
        refetchType: 'active',
      }),
  });
}
