import { z } from 'zod';

import { ExerciseEntity } from './exercise.entity';

export const FeedbackEvaluationSchema = z.object({
  prompt: z.string().describe('The original prompt from the exercise.'),
  response: z.string().describe("The learner's response."),
  feedback: z
    .string()
    .describe('Overall feedback for the response. Max 20 words.'),
  correctness: z
    .object({
      score: z.number().min(0).max(100).describe('Correctness score (0-100).'),
      feedback: z.string().describe('Correctness feedback. Max 20 words.'),
      fixes: z.array(z.string()).describe('List of grammar/spelling fixes.'),
      correctedSentence: z
        .string()
        .describe('Corrected version of the sentence.'),
    })
    .describe("Check spelling & grammar of learner's response."),
  appropriateness: z
    .object({
      feedback: z
        .string()
        .describe('Overall appropriateness feedback. Max 20 words.'),
      clarity: z
        .object({
          score: z.number().min(0).max(100).describe('Clarity score (0-100).'),
          feedback: z.string().describe('Clarity feedback. Max 20 words.'),
        })
        .describe('Is the response easy to understand and free of ambiguity?'),
      politeness: z
        .object({
          score: z
            .number()
            .min(0)
            .max(100)
            .describe('Politeness score (0-100).'),
          feedback: z.string().describe('Politeness feedback. Max 20 words.'),
        })
        .describe('Does it show courtesy or acknowledge the other person?'),
      tone: z
        .object({
          score: z.number().min(0).max(100).describe('Tone score (0-100).'),
          feedback: z.string().describe('Tone feedback. Max 20 words.'),
        })
        .describe(
          'Does the emotional tone fit the situation (friendly, professional, humorous)?',
        ),
    })
    .describe('Check response is relevant with the prompt'),
});

export type FeedbackEvaluation = z.infer<typeof FeedbackEvaluationSchema>;

export const RESPONSE_EVALUATION_SERVICE = Symbol('ResponseEvaluationService');

export interface ResponseEvaluationService {
  evaluate(
    exercise: ExerciseEntity,
    response: string,
  ): Promise<FeedbackEvaluation>;
}
