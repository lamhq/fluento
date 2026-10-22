import { z } from 'zod';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { exerciseStatusSchema } from '../../../core/types/exercise-status';

// trim a text value and return `undefined` if string is empty
const trimText = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : undefined));

// trim an array of text lines, remove empty lines, and return `undefined` if array is empty
const trimLines = z.array(z.string()).transform((items) => {
  const trimmedItems = items.flatMap((item) => {
    const trimmed = item.trim();
    return trimmed.length > 0 ? [trimmed] : [];
  });

  return trimmedItems.length > 0 ? trimmedItems : undefined;
});

// check if a string is not empty
const nonEmptyText = z
  .string({ error: 'Please enter a value.' })
  .nonempty('Please enter a value.');

// check if an array of strings is not empty
const linesErrorMessage = 'Please enter at least one item.';
const nonEmptyList = z
  .array(z.string(), { error: linesErrorMessage })
  .nonempty(linesErrorMessage);

// schemas
const commonFields = {
  status: exerciseStatusSchema,
  topics: trimLines.pipe(nonEmptyList),
  references: trimLines.pipe(nonEmptyList.optional()).optional(),
};

const communicationFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Communication),
  scenario: trimText.pipe(nonEmptyText),
  prompts: trimLines.pipe(nonEmptyList),
  validResponses: trimLines.pipe(nonEmptyList),
});

const wordFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Word),
  word: trimText.pipe(nonEmptyText),
  meaning: trimText.pipe(nonEmptyText),
  sentences: trimLines.pipe(nonEmptyList.optional()).optional(),
  clues: trimLines.pipe(nonEmptyList.optional()).optional(),
});

const sentenceFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Sentence),
  sentence: trimText.pipe(nonEmptyText),
  scenario: trimText.pipe(nonEmptyText),
  words: trimLines.pipe(nonEmptyList.optional()).optional(),
});

const paragraphFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Paragraph),
  paragraph: trimText.pipe(nonEmptyText),
  scenario: trimText.pipe(nonEmptyText),
  words: trimLines.pipe(nonEmptyList.optional()).optional(),
});

export const exerciseFormSchema = z.discriminatedUnion('format', [
  communicationFields,
  wordFields,
  sentenceFields,
  paragraphFields,
]);

export type ExerciseFormData = z.infer<typeof exerciseFormSchema>;
