import type { NewUserSchemaProps } from '@/features/accounts/schema/new-user.schema';
import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import type { EditUserSchemaProps } from '../schema/edit-user.schema';

type UpsertUserAccountProps<TMode extends 'create' | 'edit'> = TMode extends 'create'
  ? { mode: 'create'; data: NewUserSchemaProps }
  : { mode: 'edit'; data: EditUserSchemaProps; userId: string };

export async function upsertUserAccount<TMode extends 'create' | 'edit'>(
  params: UpsertUserAccountProps<TMode>,
) {
  const formData = new FormData();
  const { mode, data: schema } = params;

  formData.append('firstName', schema.firstName);
  formData.append('lastName', schema.lastName);
  formData.append('phoneNumber', schema.phoneNumber);
  formData.append('role', schema.role);
  formData.append('email', schema.email);

  if (schema.image) {
    formData.append('image', schema.image);
  }

  if (mode === 'create') {
    const createData = schema as NewUserSchemaProps;
    formData.append('username', createData.username);
    formData.append('password', createData.password);
  }

  const endpoint =
    mode === 'edit' && 'userId' in params
      ? `/api/users/upsert?mode=edit&userId=${params.userId}`
      : '/api/users/upsert?mode=create';

  const [response, error] = await catchFetch<ResponseData<Users>>(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (error) throw error;

  return response.data;
}
