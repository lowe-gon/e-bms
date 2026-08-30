import { createSector } from '@/features/sectors/api/create-sector.api';
import { getQueryClient } from '@/lib/query-client';
import { mutationOptions } from '@tanstack/react-query';

export function createSectorMutationOptions() {
  const queryClient = getQueryClient();

  return mutationOptions({
    mutationKey: ['sectors'],
    mutationFn: createSector,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sectors'] }),
  });
}
