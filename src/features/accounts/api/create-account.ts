import type { NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';

export async function createUserAccount(schema: NewUserSchemaProps) {
  const formData = new FormData();

  formData.append('firstName', schema.firstName);
  formData.append('lastName', schema.lastName);
  formData.append('phoneNumber', schema.phoneNumber);
  formData.append('role', schema.role);
  formData.append('username', schema.username);
  formData.append('password', schema.password);
  formData.append('image', schema.image);

  const [data, error] = await catchFetch<ResponseData<Users>>('/api/users/create', {
    method: 'POST',

    body: formData,
  });

  if (error) throw error;

  return data.data;
}
