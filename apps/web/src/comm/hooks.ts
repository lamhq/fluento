import { queryOptions, useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '../api';
import { PracticeExerciseSchema, SubmitResponseSchema } from './schemas';
import { type PracticeExercise, type SubmitResponse } from './types';

export { PracticeExerciseSchema, SubmitResponseSchema } from './schemas';
export type { PracticeExercise, SubmitResponse } from './types';

export const PRACTICE_EXERCISES_QUERY_KEY = ['practice-page', 'exercises'];

export function usePracticeExercise(): PracticeExercise | null {
  const apiClient = useApiClient();
  const result = useSuspenseQuery(
    queryOptions({
      queryKey: PRACTICE_EXERCISES_QUERY_KEY,
      queryFn: async () => {
        try {
          const response = await apiClient.get('/practice/exercises', {
            params: {
              sort: 'lastPracticeAt',
              dir: 'asc',
              limit: 1,
              offset: 0,
            },
          });

          const ApiResponseSchema = z.array(PracticeExerciseSchema);
          const parsed = ApiResponseSchema.safeParse(response.data);
          if (!parsed.success) {
            throw new Error('Invalid exercise response from server.');
          }

          return parsed.data;
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
    }): Promise<SubmitResponse> => {
      const result = await apiClient.post(
        `/comm/exercises/${exerciseId}/responses`,
        {
          response,
        },
      );

      const parsed = SubmitResponseSchema.safeParse(result.data);
      if (!parsed.success) {
        throw new Error('Invalid response feedback from server.');
      }

      return parsed.data;
    },
  });

  return {
    submitResponse: mutation.mutateAsync,
  };
}
