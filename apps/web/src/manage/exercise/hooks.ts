import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '../../api';
import type { CreateExerciseInput } from '../../api/types';

export function useTopicsQuery() {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ['exercise-topics'],
    queryFn: ({ signal }) => apiClient.getTopics(signal),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExerciseInput) => apiClient.createExercise(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['exercises'] });
    },
  });
}
