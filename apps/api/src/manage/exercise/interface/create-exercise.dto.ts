import { z } from 'zod';

import {
  ExerciseFormat,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';

const trimmedText = z.string().trim();
const nonEmptyText = trimmedText.min(1);
const nonEmptyTextList = z
  .array(trimmedText)
  .transform((items) => items.filter((item) => item.length > 0))
  .pipe(z.array(trimmedText).min(1, 'must contain at least one non-empty value'));

const commonFields = {
  topics: nonEmptyTextList,
  references: nonEmptyTextList.optional(),
  status: z.enum(ExerciseStatus),
};

const communicationFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Communication),
  scenario: nonEmptyText,
  prompts: nonEmptyTextList,
  validResponses: nonEmptyTextList,
});

const wordFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Word),
  word: nonEmptyText,
  meaning: nonEmptyText,
  sentences: nonEmptyTextList,
  clues: nonEmptyTextList,
});

const sentenceFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Sentence),
  sentence: nonEmptyText,
  words: nonEmptyTextList,
  scenario: nonEmptyText,
});

const paragraphFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Paragraph),
  paragraph: nonEmptyText,
  words: nonEmptyTextList,
  scenario: nonEmptyText,
});

export const createExerciseSchema = z.discriminatedUnion('format', [
  communicationFields,
  wordFields,
  sentenceFields,
  paragraphFields,
]);

export type CreateExerciseDto = z.output<typeof createExerciseSchema>;
