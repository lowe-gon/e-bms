import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';

export async function deleteUser(userId: string) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(
    `api/users/delete?userId=${userId}`,
    {
      method: 'DELETE',
    },
  );

  if (error) throw error;

  return data;
}
