import type { TUpdateAccountFormSchema } from '@/features/accounts/schemas/account-form.schema';
import { fetcher } from '@/lib/fetcher';
import type { TUsers } from '@/typings';

export async function updateUser(schema: TUpdateAccountFormSchema, userId: string) {
  const [data, error] = await fetcher<TUsers>(`/api/users/account?userId=${userId}`, {
    method: 'PUT',
    body: JSON.stringify(schema),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
