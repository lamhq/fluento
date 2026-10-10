import { z } from 'zod';

export const findPracticeExercisesSchema = z.object({
  sort: z.string().optional(),
  limit: z.coerce.number().int().default(10),
  topics: z.preprocess(
    (value) => (typeof value === 'string' ? value.split(',') : value),
    z.array(z.string()).optional(),
  ),
});

export type FindPracticeExercisesDto = z.output<
  typeof findPracticeExercisesSchema
>;
