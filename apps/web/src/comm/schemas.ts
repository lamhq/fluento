import { z } from 'zod';

export const PracticeExerciseSchema = z.object({
  id: z.string(),
  lastPracticeAt: z.string().nullable().optional(),
  topics: z.array(z.string()),
  scenario: z.string(),
  learnerRole: z.string(),
  counterpartRole: z.string(),
  prompts: z.array(z.string()).min(1, 'Exercise prompts must not be empty.'),
  expectedResponses: z.array(
    z.object({
      content: z.string(),
      style: z.array(z.string()),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const SubmitResponseSchema = z.object({
  id: z.string(),
  exerciseId: z.string(),
  response: z.string(),
  score: z.number(),
  feedback: z.string(),
  correctness: z.object({
    score: z.number(),
    feedback: z.string(),
    fixes: z.array(z.string()),
    correctedSentence: z.string(),
  }),
  appropriateness: z.object({
    score: z.number(),
    feedback: z.string(),
    clarity: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    politeness: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
    tone: z.object({
      score: z.number(),
      feedback: z.string(),
    }),
  }),
});
