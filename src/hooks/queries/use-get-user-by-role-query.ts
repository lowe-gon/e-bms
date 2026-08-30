import { catchFetch } from '@/lib/try-catch';
import { type ResponseData, type UserRole, type Users } from '@/typings';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

async function getUserByRole(role: UserRole) {
  const [data, error] = await catchFetch<ResponseData<Users[]>>(
    `/api/users/getByRole?role=${role}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (error) throw error;

  return data;
}

export default function useGetUserByRoleQuery(role: UserRole = 'captain') {
  return useQuery({
    queryKey: ['users', role],
    queryFn: async () => getUserByRole(role),
    placeholderData: keepPreviousData,
  });
}
