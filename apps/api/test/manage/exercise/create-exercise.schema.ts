import { z } from 'zod';

export const createExerciseResponseSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  skill: z.enum(['communication', 'vocabulary', 'articulation']),
  format: z.enum(['communication', 'word', 'sentence', 'paragraph']),
  topics: z.array(z.string()),
  createdAt: z.iso.datetime(),
  status: z.enum(['active', 'archived']),
});
