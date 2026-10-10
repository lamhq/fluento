import { useQuery } from '@tanstack/react-query';

import { useApiClient } from '../../api';

export function useTopicsQuery() {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['exercise-topics'],
    queryFn: ({ signal }) => apiClient.getTopics(signal),
    staleTime: 1000 * 60 * 5,
  });
}
