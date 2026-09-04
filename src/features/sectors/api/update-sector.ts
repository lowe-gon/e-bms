import type { TSectorFormSchema } from '@/features/sectors/schemas/sector-form.schema';
import { fetcher } from '@/lib/fetcher';
import type { TUserWithSector } from '@/typings';
import type { ApiResponse } from '@/typings/api.types';

export async function updateSector(schema: TSectorFormSchema, sectorId: string) {
  const [data, error] = await fetcher<ApiResponse<TUserWithSector[]>>(
    `/api/sectors?sectorId=${sectorId}`,
    {
      method: 'PUT',
      body: JSON.stringify(schema),
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
