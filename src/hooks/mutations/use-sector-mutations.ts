import { getQueryClient } from '@/lib/query-client';
import { catchFetch } from '@/lib/try-catch';
import type { ResponseData } from '@/typings';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

async function deleteSectorByIdApi(id: string) {
  const [data, error] = await catchFetch<ResponseData<null>>(`/api/sectors/delete?sectorId=${id}`, {
    method: 'DELETE',
  });

  if (error) throw error;

  return data;
}

export function useSectorDeleteByIdMutation() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['sectors'],
    mutationFn: deleteSectorByIdApi,
    onSuccess: () => {
      toast.success('Successfully deleted');
      queryClient.invalidateQueries({ queryKey: ['sectors'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error && error.message);
    },
  });
}
