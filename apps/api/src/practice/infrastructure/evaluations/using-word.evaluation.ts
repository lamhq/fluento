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
 * Schema for Using Word practice type evaluation
 * Evaluates how naturally and accurately the target word/phrase is used
 */
const UsingWordEvaluationSchema = z.object({
  feedback: z.string().describe('Overall feedback (max 120 char).'),
  correctness: correctnessSchema,
  appropriateness: z
    .object({
      score: z.number().describe('Appropriateness score (0-100).'),
      feedback: z.string().describe('Appropriateness feedback (max 120 char).'),
    })
    .describe('How naturally and accurately the target word is used.'),
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
    const topic = context.exercise.topics.join(', ');

    return `## Task

Review the sentence and give feedback on correctness and appropriateness of word usage.

## Inputs

- **Practice**: Make a sentence using the study word.
- **Topic:** ${topic}
- **Target word:** ${word}
- **Meaning:** ${meaning}
- **Sentence:** "${context.response}"`;
  }
}
