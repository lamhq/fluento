import { z } from 'zod';

import { createOffsetPaginatedSchema } from '../../common/schemas';
import { ExerciseFormat } from './exercise-format';
import { exerciseSkillSchema } from './exercise-skill';
import { exerciseStatusSchema } from './exercise-status';

const exerciseBaseSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  skill: exerciseSkillSchema,
  topics: z.array(z.string()),
  references: z.array(z.string()).optional(),
  createdAt: z.iso.datetime(),
  status: exerciseStatusSchema,
});

export const exerciseSchema = z.discriminatedUnion('format', [
  exerciseBaseSchema.extend({
    format: z.literal(ExerciseFormat.COMMUNICATION),
    scenario: z.string().optional(),
    prompts: z.array(z.string()),
    validResponses: z.array(z.string()),
  }),
  exerciseBaseSchema.extend({
    format: z.literal(ExerciseFormat.WORD),
    word: z.string(),
    meaning: z.string(),
    sentences: z.array(z.string()).optional(),
    clues: z.array(z.string()).optional(),
  }),
  exerciseBaseSchema.extend({
    format: z.literal(ExerciseFormat.SENTENCE),
    sentence: z.string().optional(),
    scenario: z.string(),
    words: z.array(z.string()).optional(),
  }),
  exerciseBaseSchema.extend({
    format: z.literal(ExerciseFormat.PARAGRAPH),
    paragraph: z.string().optional(),
    scenario: z.string(),
    words: z.array(z.string()).optional(),
  }),
]);

export const paginatedExerciseSchema = createOffsetPaginatedSchema(exerciseSchema);

export type Exercise = z.infer<typeof exerciseSchema>;
