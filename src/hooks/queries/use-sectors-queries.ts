import { catchFetch } from '@/lib/try-catch';
import { type ResponseData, type UsersWithSectors } from '@/typings';
import { useQuery } from '@tanstack/react-query';

async function getAllSectorsApi() {
  const [data, error] = await catchFetch<ResponseData<UsersWithSectors[]>>('/api/sectors/getAll', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
async function getByIdSectorsApi() {
  const [data, error] = await catchFetch('/api/sectors/getById');

  if (error) {
    throw error;
  }

  return data;
}

export function useGetAllSectorsQuery() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: getAllSectorsApi,
  });
}
