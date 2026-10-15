import { z } from 'zod';

import {
  ExerciseFormat,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';

const nonEmptyText = z.string().trim().nonempty();
const nonEmptyList = z
  .array(z.string())
  .transform((items) =>
    items.flatMap((item) => {
      const trimmed = item.trim();
      return trimmed.length > 0 ? [trimmed] : [];
    }),
  )
  .pipe(z.array(z.string()).nonempty());

const commonFields = {
  topics: nonEmptyList,
  references: nonEmptyList.optional(),
  status: z.enum(ExerciseStatus),
};

const communicationFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Communication),
  scenario: nonEmptyText,
  prompts: nonEmptyList,
  validResponses: nonEmptyList,
});

const wordFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Word),
  word: nonEmptyText,
  meaning: nonEmptyText,
  sentences: nonEmptyList.optional(),
  clues: nonEmptyList.optional(),
});

const sentenceFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Sentence),
  sentence: nonEmptyText,
  scenario: nonEmptyText,
  words: nonEmptyList.optional(),
});

const paragraphFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Paragraph),
  paragraph: nonEmptyText,
  scenario: nonEmptyText,
  words: nonEmptyList.optional(),
});

export const createExerciseSchema = z.discriminatedUnion('format', [
  communicationFields,
  wordFields,
  sentenceFields,
  paragraphFields,
]);

export type CreateExerciseDto = z.output<typeof createExerciseSchema>;
