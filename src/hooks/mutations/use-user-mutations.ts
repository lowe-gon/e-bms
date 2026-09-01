import type {
  CreateUserFormSchemaProps,
  EditUserFormSchemaProps,
} from '@/features/accounts/schema/user-form.scheme';
import { getQueryClient } from '@/lib/query-client';
import { catchFetch } from '@/lib/try-catch';
import type { ResponseData, Users } from '@/typings';
import { useMutation } from '@tanstack/react-query';

async function createUserApi(schema: CreateUserFormSchemaProps) {
  const formData = new FormData();

  formData.append('firstName', schema.firstName);
  formData.append('lastName', schema.lastName);
  formData.append('phoneNumber', schema.phoneNumber);
  formData.append('role', schema.role);

  if (schema.emailAddress && schema.username && schema.password) {
    formData.append('username', schema.username);
    formData.append('password', schema.password);
    formData.append('emailAddress', schema.emailAddress);
  }

  if (schema.image) {
    formData.append('image', schema.image);
  }

  const [data, error] = await catchFetch<ResponseData<Users | []>>('/api/users/upsert', {
    method: 'POST',
    body: formData,
  });

  if (error) {
    throw error;
  }

  return data;
}

async function updateUserApi(schema: EditUserFormSchemaProps, userId: string) {
  const formData = new FormData();

  formData.append('firstName', schema.lastName);
  formData.append('lastName', schema.lastName);
  formData.append('phoneNumber', schema.phoneNumber);
  formData.append('role', schema.role);

  if (schema.emailAddress) {
    formData.append('emailAddress', schema.emailAddress);
  }

  if (schema.image) {
    formData.append('image', schema.image);
  }

  const [data, error] = await catchFetch<ResponseData<Users | []>>(
    `/api/users/upsert?userId=${userId}`,
    {
      method: 'PUT',
      body: formData,
    },
  );

  if (error) {
    throw error;
  }

  return data;
}

async function deleteUserByIdApi(userId: string) {
  const [data, error] = await catchFetch<ResponseData<Users | []>>(
    `/api/users/delete?userId=${userId}`,
    {
      method: 'DELETE',
    },
  );

  if (error) {
    throw error;
  }

  return data;
}

export function useCreateUserMutation() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: createUserApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' }),
  });
}

export function useUpdateUserMutation() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async ({ data, userId }: { data: EditUserFormSchemaProps; userId: string }) =>
      await updateUserApi(data, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' }),
  });
}

export function useDeleteUserMutation() {
  const queryClient = getQueryClient();

  return useMutation({
    mutationKey: ['users'],
    mutationFn: async (userId: string) => await deleteUserByIdApi(userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'], refetchType: 'all' }),
  });
}
