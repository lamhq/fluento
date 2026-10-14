import { z } from 'zod';

import { PracticeType, practiceTypeSchema } from './practice-type';

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
    practiceType: z.literal(PracticeType.COMMUNICATION),
    correctness: correctnessSchema,
    appropriateness: communicationAppropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.USING_WORD),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.SENTENCE_CONSTRUCTION),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.SENTENCE_VARIATION),
    correctness: correctnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.PARAGRAPH_VARIATION),
    correctness: sentenceCorrectnessSchema,
    appropriateness: appropriatenessSchema,
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.JUST_ONE_WORD),
  }),
  responseBaseSchema.extend({
    practiceType: z.literal(PracticeType.WORD_GUESSING),
  }),
]);

export type PracticeAttempt = z.infer<typeof practiceAttemptSchema>;
