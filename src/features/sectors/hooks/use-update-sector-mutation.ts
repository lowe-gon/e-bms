import { updateSector } from '@/features/sectors/api/update-sector';
import type { TSectorFormSchema } from '@/features/sectors/schemas/sector-form.schema';
import { getQueryClient } from '@/lib/query-client';
import { useMutation } from '@tanstack/react-query';

type Variables = { schema: TSectorFormSchema; sectorId: string };

export default function useUpdateSectorMutation() {
  const queryClient = getQueryClient();
  return useMutation({
    mutationKey: ['update-sector'],
    mutationFn: async (variables: Variables) => updateSector(variables.schema, variables.sectorId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['councilors'],
        refetchType: 'active',
      }),
  });
}
