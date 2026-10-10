import { z } from 'zod';

export const exerciseSkillSchema = z.enum([
  'communication',
  'vocabulary',
  'articulation',
]);

export const exerciseFormatSchema = z.enum([
  'communication',
  'word',
  'sentence',
  'paragraph',
]);

export const exerciseStatusSchema = z.enum(['active', 'archived']);

export const exerciseSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  skill: exerciseSkillSchema,
  format: exerciseFormatSchema,
  topics: z.array(z.string()),
  createdAt: z.iso.datetime(),
  status: exerciseStatusSchema,
});

export const paginatedExerciseSchema = z.object({
  total: z.number().int().nonnegative(),
  offset: z.number().int().nonnegative(),
  limit: z.number().int().positive(),
  items: z.array(exerciseSchema),
});

export const topicSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  createdAt: z.iso.datetime(),
});

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
    skill: z.literal('communication'),
    format: z.literal('communication'),
    scenario: z.string().nonempty(),
    prompts: z.array(z.string().nonempty()).nonempty(),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal('vocabulary'),
    format: z.literal('word'),
    word: z.string().nonempty(),
    meaning: z.string().nonempty(),
    clues: z.array(z.string().nonempty()),
    sentences: z.array(z.string().nonempty()),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal('articulation'),
    format: z.literal('sentence'),
    scenario: z.string().nonempty(),
    sentence: z.string().nonempty(),
    words: z.array(z.string().nonempty()),
  }),
  practiceExerciseBaseSchema.extend({
    skill: z.literal('articulation'),
    format: z.literal('paragraph'),
    scenario: z.string().nonempty(),
    paragraph: z.string().nonempty(),
    words: z.array(z.string().nonempty()),
  }),
]);

export const paginatedPracticeExerciseSchema = z.object({
  items: z.array(practiceExerciseSchema),
  nextCursor: z.string().nullable(),
  previousCursor: z.string().nullable(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const practiceTypeSchema = z.enum([
  'communication',
  'using-word',
  'just-one-word',
  'word-guessing',
  'sentence-construction',
  'sentence-variation',
  'paragraph-variation',
]);

const responseBaseSchema = z.object({
  id: z.string(),
  practiceType: practiceTypeSchema,
  score: z.number().min(0).max(100),
  feedback: z.string().nonempty(),
});

const correctnessSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().nonempty(),
  fixes: z.array(z.string().nonempty()),
  correctedSentence: z.string(),
});

const sentenceCorrectnessSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().nonempty(),
  sentences: z.array(
    z.object({
      sentence: z.string(),
      score: z.number().min(0).max(100),
      feedback: z.string().nonempty(),
      fixes: z.array(z.string().nonempty()),
      correctedSentence: z.string(),
    }),
  ),
});

const appropriatenessSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string().nonempty(),
});

const communicationAppropriatenessSchema = appropriatenessSchema.extend({
  clarity: appropriatenessSchema,
  politeness: appropriatenessSchema,
  tone: appropriatenessSchema,
});

export const practiceAttemptSchema = z.discriminatedUnion('practiceType', [
  responseBaseSchema.extend({
    practiceType: z.literal('communication'),
    correctness: correctnessSchema,
    appropriateness: communicationAppropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('using-word'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('sentence-construction'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('sentence-variation'),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('paragraph-variation'),
    correctness: sentenceCorrectnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('just-one-word'),
  }),
  responseBaseSchema.extend({
    practiceType: z.literal('word-guessing'),
  }),
]);
