import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useHttpClient } from './http';

const SERVER_DATA = ['server-data'];

export function useServerData() {
  const httpClient = useHttpClient();
  const result = useSuspenseQuery(
    queryOptions({
      queryKey: SERVER_DATA,
      queryFn: async () => {
        const resp = await httpClient<string[]>({
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
  const httpClient = useHttpClient();
  const queryClient = useQueryClient();

  const result = useMutation({
    mutationFn: async () => {
      const resp = await httpClient<string>({
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
