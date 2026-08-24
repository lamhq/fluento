import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useApiClient } from '../api';

const SERVER_DATA = ['server-data'];

export function useServerData() {
  const apiClient = useApiClient();
  const result = useSuspenseQuery(
    queryOptions({
      queryKey: SERVER_DATA,
      queryFn: async () => {
        const resp = await apiClient<string[]>({
          url: '/',
          method: 'GET',
        });
        return resp.data;
      },
    }),
  );
  return result.data;
}

export function useUpdateServerData() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: async () => {
      const resp = await apiClient<string>({
        url: '/',
        method: 'GET',
      });
      return resp.data;
    },
    onSuccess: () => {
      void queryClient.resetQueries({ queryKey: SERVER_DATA });
    },
  });

  return result;
}
