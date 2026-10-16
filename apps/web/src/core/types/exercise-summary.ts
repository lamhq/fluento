import { z } from 'zod';

import { createOffsetPaginatedSchema } from '../../common/schemas';
import { exerciseFormatSchema } from './exercise-format';
import { exerciseSkillSchema } from './exercise-skill';
import { exerciseStatusSchema } from './exercise-status';

export const exerciseSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  skill: exerciseSkillSchema,
  format: exerciseFormatSchema,
  topics: z.array(z.string()),
  createdAt: z.iso.datetime(),
  status: exerciseStatusSchema,
});

export const paginatedExerciseSummarySchema =
  createOffsetPaginatedSchema(exerciseSummarySchema);

export type ExerciseSummary = z.infer<typeof exerciseSummarySchema>;
