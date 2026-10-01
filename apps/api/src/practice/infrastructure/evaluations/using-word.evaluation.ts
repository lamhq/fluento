import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';

import { AI_SERVICE, type AiService } from '../../core/ai.service';
import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
  type NextFunction,
} from '../../core/evaluation.service';
import { PracticeType } from '../../core/types';

/**
 * Schema for Using Word practice type evaluation
 * Evaluates how naturally and accurately the target word/phrase is used
 */
const UsingWordEvaluationSchema = z.object({
  score: z.number().min(0).max(100).describe('Overall score (0-100).'),
  feedback: z.string().describe('Overall feedback. Max 20 words.'),
  correctness: z.object({
    score: z.number().min(0).max(100).describe('Correctness score (0-100).'),
    feedback: z.string().describe('Correctness feedback. Max 20 words.'),
    fixes: z.array(z.string()).describe('List of grammar/spelling fixes.'),
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
      .describe('Feedback on how naturally the word is used. Max 20 words.'),
  }),
});

/**
 * Evaluates Using Word practice type responses using AI
 */
@Injectable()
export class UsingWordEvaluation implements EvaluationService {
  constructor(@Inject(AI_SERVICE) private readonly aiService: AiService) {}

  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.UsingWord) {
      return next();
    }

    const evaluation = await this.aiService.invoke(
      this.buildPrompt(context),
      UsingWordEvaluationSchema,
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
    const word = context.exercise.word ?? '';
    const meaning = context.exercise.meaning ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const topic = context.exercise.topics?.[0] ?? 'N/A';

    return `## Task

Review the sentence and give feedback on correctness and appropriateness of word usage.

## Inputs

- **Practice**: Make a sentence using the study word.
- **Topic:** ${topic}
- **Target word:** ${word}
- **Meaning:** ${meaning}
- **Learner Response:** "${context.response}"`;
  }
}
