import { z } from 'zod';

import { createExerciseSchema } from './create-exercise.dto.js';

export const updateExerciseSchema = createExerciseSchema;

export type UpdateExerciseDto = z.output<typeof updateExerciseSchema>;
