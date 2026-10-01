import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';

import { AI_SERVICE, type AiService } from '../../core/ai.service';
import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
  type NextFunction,
} from '../../core/evaluation.service';
import { PracticeType } from '../../core/practice-attempt.entity';

/**
 * Schema for Sentence Construction practice type evaluation
 * Evaluates correctness and if all required words are used appropriately
 */
const SentenceConstructionEvaluationSchema = z.object({
  score: z.number().min(0).max(100).describe('Overall score (0-100).'),
  feedback: z.string().describe('Overall feedback. Max 20 words.'),
  correctness: z.object({
    score: z.number().min(0).max(100).describe('Correctness score (0-100).'),
    feedback: z.string().describe('Correctness feedback. Max 20 words.'),
    fixes: z
      .array(z.string())
      .describe('List of grammar/spelling fixes or improvements.'),
    correctedSentence: z
      .string()
      .describe('Corrected version of the response (empty if no corrections).'),
  }),
  appropriateness: z.object({
    score: z
      .number()
      .min(0)
      .max(100)
      .describe('Appropriateness score (0-100).'),
    feedback: z
      .string()
      .describe(
        'Feedback on required words usage and naturalness. Max 20 words.',
      ),
  }),
});

/**
 * Evaluates Sentence Construction practice type responses using AI
 * Checks if all required words are used and the sentence is grammatically correct
 */
@Injectable()
export class SentenceConstructionEvaluation implements EvaluationService {
  constructor(@Inject(AI_SERVICE) private readonly aiService: AiService) {}

  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.SentenceConstruction) {
      return next();
    }

    const evaluation = await this.aiService.invoke(
      this.buildPrompt(context),
      SentenceConstructionEvaluationSchema,
    );

    const overallScore =
      (evaluation.correctness.score + evaluation.appropriateness.score) / 2;

    return {
      score: overallScore,
      feedback: evaluation.feedback,
      correctness: evaluation.correctness,
      appropriateness: evaluation.appropriateness,
    };
  }

  private buildPrompt(context: EvaluationContext): string {
    const words = (context.exercise.words ?? []).join(', ');
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const topic = context.exercise.topics?.[0] ?? 'N/A';

    return `## Task

Review the provided sentence and give feedback on correctness and appropriateness.

## Inputs

- **Practice**: Make a sentence using provided words
- **Topic:** ${topic}
- **Required words:** ${words}
- **Learner Response:** "${context.response}"`;
  }
}
