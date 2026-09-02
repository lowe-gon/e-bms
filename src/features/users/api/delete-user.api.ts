import { fetcher } from '@/lib/fetcher';

export async function deleteUser(userId: string) {
  const [data, error] = await fetcher<null>(`/api/users/account?userId=${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
