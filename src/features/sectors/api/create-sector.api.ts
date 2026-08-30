import type { SectorFormSchemaProps } from '@/features/sectors/schema/sector-form.schema';
import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, Sectors } from '@/typings';

export async function createSector(schema: SectorFormSchemaProps) {
  const [data, error] = await catchFetch<ResponseData<Sectors[]>>(`api/sectors/create`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(schema),
  });

  if (error) throw error;

  return data;
}
