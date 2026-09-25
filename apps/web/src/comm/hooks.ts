import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { useApiClient } from '../api';

const PRACTICE_EXERCISES_QUERY_KEY = ['practice-page', 'exercises'];

export function usePracticeExercise() {
  const apiClient = useApiClient();
  const result = useSuspenseQuery(
    queryOptions({
      queryKey: PRACTICE_EXERCISES_QUERY_KEY,
      queryFn: async () => {
        try {
          const { items } = await apiClient.getPracticeExercise();
          return items;
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Unable to load exercise.');
        }
      },
    }),
  );

  return result.data[0] ?? null;
}

export function useSubmitResponse() {
  const apiClient = useApiClient();
  const mutation = useMutation({
    mutationFn: async ({
      exerciseId,
      response,
    }: {
      exerciseId: string;
      response: string;
    }) => {
      return apiClient.submitPracticeResponse(exerciseId, response);
    },
  });

  return mutation.mutateAsync;
}

export function useResetPracticeExercise() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: PRACTICE_EXERCISES_QUERY_KEY });
  };
}
