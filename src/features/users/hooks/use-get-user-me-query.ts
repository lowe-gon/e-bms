import { useQuery } from '@tanstack/react-query';
import { getUser } from '../api/get-user.api';

export default function useGetUserMeQuery() {
  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async ({ signal }) => await getUser(signal),
  });
}
