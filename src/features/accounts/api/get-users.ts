import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, ResponseMetadata, Users } from '@/typings';

export async function getUsers({}: ResponseMetadata) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(`api/users/getAll`, {
    method: 'GET',
  });

  if (error) throw error;

  return data;
}
