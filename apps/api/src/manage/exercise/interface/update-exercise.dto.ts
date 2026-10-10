import { z } from 'zod';

import { createExerciseSchema } from './create-exercise.dto';

export const updateExerciseSchema = createExerciseSchema;

export type UpdateExerciseDto = z.output<typeof updateExerciseSchema>;
