import { z } from 'zod';

import { PracticeExerciseSchema, SubmitResponseSchema } from './schemas';

export type PracticeExercise = z.infer<typeof PracticeExerciseSchema>;

export type SubmitResponse = z.infer<typeof SubmitResponseSchema>;
