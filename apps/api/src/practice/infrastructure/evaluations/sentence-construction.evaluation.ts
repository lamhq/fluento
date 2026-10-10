import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';

import { AI_SERVICE, type AiService } from '../../core/ai.service.js';
import {
  type EvaluationContext,
  type EvaluationResult,
  type EvaluationService,
  type NextFunction,
} from '../../core/evaluation.service.js';
import { PracticeType } from '../../core/types.js';
import { correctnessSchema } from './correctness.schema.js';

/**
 * Schema for Sentence Construction practice type evaluation
 * Evaluates correctness and if all required words are used appropriately
 */
const SentenceConstructionEvaluationSchema = z.object({
  feedback: z.string().describe('Overall feedback (max 120 char).'),
  correctness: correctnessSchema,
  appropriateness: z
    .object({
      score: z.number().describe('Appropriateness score (0-100).'),
      feedback: z.string().describe('Appropriateness feedback (max 120 char).'),
    })
    .describe(
      'Whether the required words are used appropriately and the sentence sounds natural.',
    ),
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
    const topic = context.exercise.topics.join(',');
    return `## Task

Review the provided sentence and give feedback on correctness and appropriateness.

## Inputs

- **Practice**: Make a sentence using provided words
- **Topic:** ${topic}
- **Required words:** ${words}
- **Sentence:** "${context.response}"`;
  }
}
