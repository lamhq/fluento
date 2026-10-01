import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { useApiClient } from '../api';
import type { PracticeExercise } from '../api/types';

const PRACTICE_EXERCISES_QUERY_KEY = ['practice-exercise'];

export function usePracticeExercise() {
  const apiClient = useApiClient();
  return useQuery(
    queryOptions({
      queryKey: PRACTICE_EXERCISES_QUERY_KEY,
      queryFn: async () => {
        try {
          const { items } = await apiClient.getPracticeExercise();
          return items.length > 0 ? items[0] : null;
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('Unable to load exercise.');
        }
      },
    }),
  );
}

export function useSubmitResponse() {
  const apiClient = useApiClient();
  const mutation = useMutation({
    mutationFn: async ({
      exerciseId,
      practiceType,
      response,
    }: {
      exerciseId: string;
      practiceType: PracticeExercise['type'];
      response: string;
    }) => {
      return apiClient.submitPracticeResponse(exerciseId, practiceType, response);
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
