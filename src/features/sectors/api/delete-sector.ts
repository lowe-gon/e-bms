import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';

export async function deleteSector(sectorId: string) {
  const [data, error] = await fetcher<ApiResponse<TUserWithSector[]>>(
    `/api/sectors?sectorId=${sectorId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (error) {
    throw error;
  }

  return data;
}
