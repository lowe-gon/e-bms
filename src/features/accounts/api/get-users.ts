import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, ResponseMetadata, Users } from '@/typings';

export async function getUsers({ limit, page, searchQuery, sortBy, sortOrder }: ResponseMetadata) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(
    `api/users/getAll?search=${searchQuery}&page=${page}&sortBy=${sortBy}&sortOrder=${sortOrder}&limit=${limit}`,
    {
      method: 'GET',
    },
  );

  if (error) throw error;

  return data;
}
