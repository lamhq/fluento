import { z } from 'zod';

import { PracticeType } from '../core/types';

export const submitResponseSchema = z.strictObject({
  practiceType: z.enum(PracticeType),
  response: z.string().trim().min(1),
});

export type SubmitResponseDto = z.output<typeof submitResponseSchema>;
