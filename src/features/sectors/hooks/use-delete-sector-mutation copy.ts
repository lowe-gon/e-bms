import { deleteSector } from '@/features/sectors/api/delete-sector';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';

export default function useDeleteSectorMutation() {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['delete-sector'],
    mutationFn: deleteSector,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['councilors'],
        refetchType: 'active',
      }),
  });
}
