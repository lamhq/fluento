import { z } from 'zod';

import { toTitleCase } from '../../../common/utils.js';
import {
  ExerciseFormat,
  ExerciseStatus,
} from '../../../content/core/exercise.entity.js';

// normalization functions for trimming text and lines
const trimText = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) return undefined;
    const trimmed = val.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  });
const trimLines = z
  .array(z.string())
  .optional()
  .transform((items) => {
    if (!items) return undefined;
    const transformed = items.flatMap((item) => {
      const trimmed = item.trim();
      return trimmed.length > 0 ? [trimmed] : [];
    });
    return transformed.length > 0 ? transformed : undefined;
  });

// validators for text and lines
const linesErrorMessage = 'Please enter at least one item.';
const nonEmptyText = z
  .string({ error: 'Please enter a value.' })
  .nonempty('Please enter a value.');
const nonEmptyList = z
  .array(z.string(), { error: linesErrorMessage })
  .nonempty(linesErrorMessage);

// schema
const commonFields = {
  status: z.enum(ExerciseStatus),
  topics: trimLines.pipe(nonEmptyList).transform((items) => items.map(toTitleCase)),
  references: trimLines.pipe(nonEmptyList.optional()),
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
  sentences: trimLines.pipe(nonEmptyList.optional()),
  clues: trimLines.pipe(nonEmptyList.optional()),
});

const sentenceFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Sentence),
  sentence: trimText.pipe(nonEmptyText),
  scenario: trimText.pipe(nonEmptyText),
  words: trimLines.pipe(nonEmptyList.optional()),
});

const paragraphFields = z.strictObject({
  ...commonFields,
  format: z.literal(ExerciseFormat.Paragraph),
  paragraph: trimText.pipe(nonEmptyText),
  scenario: trimText.pipe(nonEmptyText),
  words: trimLines.pipe(nonEmptyList.optional()),
});

export const createExerciseSchema = z.discriminatedUnion('format', [
  communicationFields,
  wordFields,
  sentenceFields,
  paragraphFields,
]);

export type CreateExerciseDto = z.output<typeof createExerciseSchema>;
