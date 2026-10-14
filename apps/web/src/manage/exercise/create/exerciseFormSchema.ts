import { z } from 'zod';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { exerciseStatusSchema } from '../../../core/types/exercise-status';

const nonEmptyStr = z.string().trim().nonempty();
const nonEmptyLines = z
  .string()
  .trim()
  .transform(
    (val) =>
      val
        .split(/\r?\n/) // 1. Split into individual lines (handles \n and \r\n)
        .map((line) => line.trim()) // 2. Trim whitespace/tabs from each line
        .filter((line) => line.length > 0) // 3. Remove empty lines
        .join('\n'), // 4. Recombine lines back into a single string
  )
  .pipe(z.string().nonempty());

const commonFields = {
  topics: z.array(nonEmptyStr),
  references: nonEmptyLines.optional().or(z.literal('')),
  status: exerciseStatusSchema,
};

export const exerciseFormSchema = z.discriminatedUnion('format', [
  z.strictObject({
    ...commonFields,
    format: z.literal(ExerciseFormat.COMMUNICATION),
    scenario: nonEmptyStr,
    prompts: nonEmptyLines,
    validResponses: nonEmptyLines,
  }),
  z.strictObject({
    ...commonFields,
    format: z.literal(ExerciseFormat.WORD),
    word: nonEmptyStr,
    meaning: nonEmptyStr,
    sentences: nonEmptyLines,
    clues: nonEmptyLines,
  }),
  z.strictObject({
    ...commonFields,
    format: z.literal(ExerciseFormat.SENTENCE),
    sentence: nonEmptyStr,
    words: nonEmptyLines,
    scenario: nonEmptyStr,
  }),
  z.strictObject({
    ...commonFields,
    format: z.literal(ExerciseFormat.PARAGRAPH),
    paragraph: nonEmptyStr,
    words: nonEmptyLines,
    scenario: nonEmptyStr,
  }),
]);

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;
