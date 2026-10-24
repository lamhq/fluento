import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '../../api';
import type { CreateExerciseInput, UpdateExerciseInput } from '../../api/types';
import type { ServerTableQueryHook } from '../../common/data-table/hooks/useServerTable';
import type { Exercise } from '../../core/types/exercise';
import type { ExerciseSummary } from '../../core/types/exercise-summary';
import { buildExerciseQuery } from './utils';

export const EXERCISE_QUERY_KEY = 'exercise';
export const EXERCISE_LIST_QUERY_KEY = 'exercises';
export const TOPIC_LIST_QUERY_KEY = 'exercise-topics';

export const useGetExercises: ServerTableQueryHook<ExerciseSummary> = ({
  pagination,
  globalFilter,
  columnFilters,
  sorting,
}) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: [
      EXERCISE_LIST_QUERY_KEY,
      pagination,
      globalFilter,
      columnFilters,
      sorting,
    ],
    queryFn: async ({ signal }) => {
      try {
        const exerciseQuery = buildExerciseQuery({
          pagination,
          columnFilters,
          sorting,
        });

        const result = await apiClient.getExercises(exerciseQuery, signal);
        return [result.total, result.items] as [number, ExerciseSummary[]];
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Unable to load exercises.');
      }
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    throwOnError: true,
  });
};

export function useGetExerciseDetails(
  exerciseId: string,
  { enabled = true }: { enabled?: boolean } = {},
) {
  const apiClient = useApiClient();
  return useQuery<Exercise>({
    queryKey: [EXERCISE_QUERY_KEY, exerciseId],
    queryFn: ({ signal }) => apiClient.getExerciseById(exerciseId, signal),
    throwOnError: true,
    enabled,
  });
}

export function useGetTopics() {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: [TOPIC_LIST_QUERY_KEY],
    queryFn: ({ signal }) => apiClient.getTopics(signal),
    throwOnError: true,
  });
}

export function useCreateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExerciseInput) => apiClient.createExercise(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [EXERCISE_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({ queryKey: [TOPIC_LIST_QUERY_KEY] }),
      ]);
    },
  });
}

export function useDeleteExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (exerciseId: string) => apiClient.deleteExercise(exerciseId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [EXERCISE_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({ queryKey: [TOPIC_LIST_QUERY_KEY] }),
      ]);
    },
  });
}

export function useUpdateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      exerciseId,
      data,
    }: {
      exerciseId: string;
      data: UpdateExerciseInput;
    }) => apiClient.updateExercise(exerciseId, data),
    onSuccess: async (_exercise, { exerciseId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: [EXERCISE_LIST_QUERY_KEY],
        }),
        queryClient.invalidateQueries({
          queryKey: [EXERCISE_QUERY_KEY, exerciseId],
        }),
        queryClient.invalidateQueries({ queryKey: [TOPIC_LIST_QUERY_KEY] }),
      ]);
    },
  });
}
