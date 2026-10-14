import { z } from 'zod';

import { createCursorPaginatedSchema } from '../../common/schemas';
import { ExerciseFormat } from './exercise-format';
import { ExerciseSkill } from './exercise-skill';
import type { PracticeType } from './practice-type';

const practiceExerciseBaseSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  topics: z.array(z.string().nonempty()).nonempty(),
  references: z.array(z.string().nonempty()),
  practicedAt: z.iso.datetime().optional(),
  practiceCount: z.number().int().nonnegative(),
  prompts: z.array(z.string()).optional(),
  validResponses: z.array(z.string()).optional(),
});

export const practiceExerciseSchema = z.discriminatedUnion('format', [
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.COMMUNICATION),
    format: z.literal(ExerciseFormat.COMMUNICATION),
    scenario: z.string().nonempty(),
    prompts: z.array(z.string().nonempty()).nonempty(),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.VOCABULARY),
    format: z.literal(ExerciseFormat.WORD),
    word: z.string().nonempty(),
    meaning: z.string().nonempty(),
    clues: z.array(z.string().nonempty()),
    sentences: z.array(z.string().nonempty()),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.ARTICULATION),
    format: z.literal(ExerciseFormat.SENTENCE),
    scenario: z.string().nonempty(),
    sentence: z.string().nonempty(),
    words: z.array(z.string().nonempty()),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.ARTICULATION),
    format: z.literal(ExerciseFormat.PARAGRAPH),
    scenario: z.string().nonempty(),
    paragraph: z.string().nonempty(),
    words: z.array(z.string().nonempty()),
  }),
]);

export const paginatedExerciseSchema = createCursorPaginatedSchema(
  practiceExerciseSchema,
);

export type PracticeExercise = z.infer<typeof practiceExerciseSchema> & {
  type: PracticeType;
};
