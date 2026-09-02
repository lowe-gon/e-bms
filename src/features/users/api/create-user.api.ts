import type { TAccountFormSchema } from '@/features/accounts/schemas/account-form.schema';
import { fetcher } from '@/lib/fetcher';
import type { TUsers } from '@/typings';

export async function createUser(schema: TAccountFormSchema) {
  const [data, error] = await fetcher<TUsers>('/api/users/account', {
    method: 'POST',
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
