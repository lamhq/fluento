import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiClient } from '../../api';
import type { CreateExerciseInput, UpdateExerciseInput } from '../../api/types';
import type { Exercise } from '../../core/types/exercise';

interface UpdateExerciseVariables {
  exerciseId: string;
  input: UpdateExerciseInput;
}

export function useGetExerciseDetails(exerciseId?: string) {
  const apiClient = useApiClient();
  return useQuery<Exercise>({
    queryKey: ['exercise', exerciseId],
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

export function useUpdateExercise() {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ exerciseId, input }: UpdateExerciseVariables) =>
      apiClient.updateExercise(exerciseId, input),
    onSuccess: async (_exercise, { exerciseId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['exercises'] }),
        queryClient.invalidateQueries({
          queryKey: ['exercise', exerciseId],
        }),
      ]);
    },
  });
}
