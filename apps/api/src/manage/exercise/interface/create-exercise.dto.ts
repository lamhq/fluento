import { z } from 'zod';

import {
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity';

const text = z.string().trim();

const commonFields = {
  name: text,
  topics: z.array(text).optional(),
  references: z.array(text).optional(),
  status: z.enum(ExerciseStatus),
};

const communicationFields = z.strictObject({
  ...commonFields,
  skill: z.literal(ExerciseSkill.Communication),
  format: z.literal(ExerciseFormat.Communication),
  scenario: text,
  prompts: z.array(text).min(1, 'must contain at least one non-empty value'),
  validResponses: z
    .array(text)
    .min(1, 'must contain at least one non-empty value'),
});

const wordFields = z.strictObject({
  ...commonFields,
  skill: z.literal(ExerciseSkill.Vocabulary),
  format: z.literal(ExerciseFormat.Word),
  word: text,
  meaning: text,
  sentences: z.array(text).min(1, 'must contain at least one non-empty value'),
  clues: z.array(text).min(1, 'must contain at least one non-empty value'),
});

const sentenceFields = z.strictObject({
  ...commonFields,
  skill: z.literal(ExerciseSkill.Articulation),
  format: z.literal(ExerciseFormat.Sentence),
  sentence: text,
  words: z.array(text).min(1, 'must contain at least one non-empty value'),
  scenario: text.optional(),
});

const paragraphFields = z.strictObject({
  ...commonFields,
  skill: z.literal(ExerciseSkill.Articulation),
  format: z.literal(ExerciseFormat.Paragraph),
  paragraph: text,
  words: z.array(text).min(1, 'must contain at least one non-empty value'),
  scenario: text.optional(),
});

const articulationFields = z.discriminatedUnion('format', [
  sentenceFields,
  paragraphFields,
]);

const CreateExerciseSchema = z.discriminatedUnion('skill', [
  communicationFields,
  wordFields,
  articulationFields,
]);

export const createExerciseSchema = CreateExerciseSchema;

export type CreateExerciseDto = z.output<typeof createExerciseSchema>;
