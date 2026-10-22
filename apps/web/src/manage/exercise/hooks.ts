import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '../../api';
import type { CreateExerciseInput, UpdateExerciseInput } from '../../api/types';
import type { Exercise } from '../../core/types/exercise';

const EXERCISE_QUERY_KEY = ['exercise'] as const;
const EXERCISE_LIST_QUERY_KEY = ['exercise_list'] as const;
const TOPIC_LIST_QUERY_KEY = ['exercise-topics'] as const;

interface UpdateExerciseVariables {
  exerciseId: string;
  input: UpdateExerciseInput;
}

export function useGetExerciseDetails(exerciseId?: string) {
  const apiClient = useApiClient();
  return useQuery<Exercise>({
    queryKey: [...EXERCISE_QUERY_KEY, exerciseId],
    queryFn: ({ signal }) => {
      if (!exerciseId) {
        throw new Error('An exercise ID is required to load exercise details.');
      }

      return apiClient.getExerciseById(exerciseId, signal);
    },
    enabled: Boolean(exerciseId),
  });
}

export function useGetTopics() {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: TOPIC_LIST_QUERY_KEY,
    queryFn: ({ signal }) => apiClient.getTopics(signal),
  });
}

export function useCreateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateExerciseInput) => apiClient.createExercise(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: EXERCISE_LIST_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: TOPIC_LIST_QUERY_KEY }),
      ]);
    },
  });
}

export function useUpdateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, input }: UpdateExerciseVariables) =>
      apiClient.updateExercise(exerciseId, input),
    onSuccess: async (_exercise, { exerciseId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: EXERCISE_LIST_QUERY_KEY }),
        queryClient.invalidateQueries({
          queryKey: [...EXERCISE_QUERY_KEY, exerciseId],
        }),
        queryClient.invalidateQueries({ queryKey: TOPIC_LIST_QUERY_KEY }),
      ]);
    },
  });
}
