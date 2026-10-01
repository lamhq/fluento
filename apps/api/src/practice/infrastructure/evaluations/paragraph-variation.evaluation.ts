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
 * Schema for Paragraph Variation practice type evaluation
 * Evaluates correctness per sentence and how well the rewritten paragraph preserves the original meaning
 */
const ParagraphVariationEvaluationSchema = z.object({
  score: z.number().min(0).max(100).describe('Overall score (0-100).'),
  feedback: z.string().describe('Overall feedback. Max 20 words.'),
  correctness: z.object({
    score: z
      .number()
      .min(0)
      .max(100)
      .describe('Overall correctness score (0-100).'),
    feedback: z
      .string()
      .describe('Overall correctness feedback. Max 20 words.'),
    sentences: z
      .array(
        z.object({
          sentence: z.string().describe('The sentence from the response.'),
          score: z
            .number()
            .min(0)
            .max(100)
            .describe('Per-sentence correctness score (0-100).'),
          feedback: z.string().describe('Per-sentence feedback. Max 20 words.'),
          fixes: z
            .array(z.string())
            .describe('List of grammar/spelling fixes for this sentence.'),
          correctedSentence: z
            .string()
            .describe(
              'Corrected version of the sentence (empty if no corrections).',
            ),
        }),
      )
      .describe('Feedback for each sentence in the response.'),
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
        'Feedback on how well the overall meaning and structure are preserved. Max 20 words.',
      ),
  }),
});

/**
 * Evaluates Paragraph Variation practice type responses using AI
 * Checks if the rewritten paragraph preserves the original meaning with per-sentence feedback
 */
@Injectable()
export class ParagraphVariationEvaluation implements EvaluationService {
  constructor(@Inject(AI_SERVICE) private readonly aiService: AiService) {}

  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.ParagraphVariation) {
      return next();
    }

    const evaluation = await this.aiService.invoke(
      this.buildPrompt(context),
      ParagraphVariationEvaluationSchema,
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
    const originalParagraph = context.exercise.prompts?.[0] ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const topic = context.exercise.topics?.[0] ?? 'N/A';

    return `## Task

Review the rewritten paragraph and give feedback on correctness and appropriateness.

## Inputs

- **Practice**: Rewrite a paragraph with the same meaning.
- **Topic:** ${topic}
- **Original paragraph:** "${originalParagraph}"
- **Learner Response:** "${context.response}"`;
  }
}
