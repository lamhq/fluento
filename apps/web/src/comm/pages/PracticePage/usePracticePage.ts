import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { z } from 'zod';

import { useApiClient } from '../../../api';

export const PracticeExerciseSchema = z.object({
  id: z.string(),
  lastPracticeAt: z.string().nullable().optional(),
  topics: z.array(z.string()),
  scenario: z.string(),
  learnerRole: z.string(),
  counterpartRole: z.string(),
  prompts: z.array(z.string()).min(1, 'Exercise prompts must not be empty.'),
  expectedResponses: z.array(
    z.object({
      content: z.string(),
      style: z.array(z.string()),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const PracticeExercisesResponseSchema = z.array(PracticeExerciseSchema);

export type PracticeExercise = z.infer<typeof PracticeExerciseSchema>;

export function usePracticePage(): { exercise: PracticeExercise | null } {
  const apiClient = useApiClient();
  const result = useSuspenseQuery(
    queryOptions({
      queryKey: ['practice-page', 'exercises'],
      queryFn: async () => {
        try {
          const response = await apiClient.get('/exercises', {
            params: {
              sort: 'lastPracticeAt',
              dir: 'asc',
              limit: 1,
              offset: 0,
            },
          });
          const parsed = PracticeExercisesResponseSchema.safeParse(response.data);

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

  return {
    exercise: result.data[0] ?? null,
  };
}
