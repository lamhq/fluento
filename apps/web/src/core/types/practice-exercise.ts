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
    skill: z.literal(ExerciseSkill.Communication),
    format: z.literal(ExerciseFormat.Communication),
    scenario: z.string().nonempty(),
    prompts: z.array(z.string().nonempty()).nonempty(),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.Vocabulary),
    format: z.literal(ExerciseFormat.Word),
    word: z.string().nonempty(),
    meaning: z.string().nonempty(),
    clues: z.array(z.string().nonempty()).optional(),
    sentences: z.array(z.string().nonempty()).optional(),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.Articulation),
    format: z.literal(ExerciseFormat.Sentence),
    scenario: z.string().nonempty(),
    sentence: z.string().nonempty(),
    words: z.array(z.string().nonempty()).optional(),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal(ExerciseSkill.Articulation),
    format: z.literal(ExerciseFormat.Paragraph),
    scenario: z.string().nonempty(),
    paragraph: z.string().nonempty(),
    words: z.array(z.string().nonempty()).optional(),
  }),
]);

export const paginatedExerciseSchema = createCursorPaginatedSchema(
  practiceExerciseSchema,
);

export type PracticeExercise = z.infer<typeof practiceExerciseSchema> & {
  type: PracticeType;
};
