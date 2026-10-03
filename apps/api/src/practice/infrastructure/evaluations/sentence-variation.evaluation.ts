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
import { correctnessSchema } from './correctness.schema';

/**
 * Schema for Sentence Variation practice type evaluation
 * Evaluates correctness and how well the rewritten sentence preserves the original meaning
 */
const SentenceVariationEvaluationSchema = z.object({
  feedback: z.string().describe('Overall feedback (max 120 char).'),
  correctness: correctnessSchema,
  appropriateness: z
    .object({
      score: z.number().describe('Appropriateness score (0-100).'),
      feedback: z.string().describe('Appropriateness feedback (max 120 char).'),
    })
    .describe('How well the original meaning is preserved.'),
});

/**
 * Evaluates Sentence Variation practice type responses using AI
 * Checks if the rewritten sentence preserves the original meaning and is grammatically correct
 */
@Injectable()
export class SentenceVariationEvaluation implements EvaluationService {
  constructor(@Inject(AI_SERVICE) private readonly aiService: AiService) {}

  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.SentenceVariation) {
      return next();
    }

    const evaluation = await this.aiService.invoke(
      this.buildPrompt(context),
      SentenceVariationEvaluationSchema,
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
    const originalSentence = context.exercise.sentence ?? '';
    const topic = context.exercise.topics.join(', ');

    return `## Task

Evaluate the rewrite's correctness and appropriateness; it must differ from the original.

## Inputs

- **Practice**: Rewrite a sentence with the same meaning.
- **Topic:** ${topic}
- **Original sentence:** "${originalSentence}"
- **Rewritten sentence:** "${context.response}"`;
  }
}
