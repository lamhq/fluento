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
 * Schema for Communication practice type evaluation
 * Evaluates correctness and appropriateness including clarity, politeness, and tone
 */
const CommunicationEvaluationSchema = z.object({
  feedback: z.string().describe('Overall feedback (max 120 char).'),
  correctness: correctnessSchema,
  appropriateness: z
    .object({
      feedback: z
        .string()
        .describe('Overall appropriateness feedback (max 120 char).'),
      clarity: z
        .object({
          score: z.number().describe('Clarity score (0-100).'),
          feedback: z.string().describe('Clarity feedback (max 120 char).'),
        })
        .describe('Is the response easy to understand and free of ambiguity?'),
      politeness: z
        .object({
          score: z.number().describe('Politeness score (0-100).'),
          feedback: z.string().describe('Politeness feedback (max 120 char).'),
        })
        .describe('Does it show courtesy or acknowledge the other person?'),
      tone: z
        .object({
          score: z.number().describe('Tone score (0-100).'),
          feedback: z.string().describe('Tone feedback (max 120 char).'),
        })
        .describe(
          'Does the emotional tone fit the situation (friendly, professional, humorous)?',
        ),
    })
    .describe(
      'How natural the response is and how relevant it is with the scenario',
    ),
});

/**
 * Evaluates Communication practice type responses using AI
 * Provides detailed feedback on correctness, clarity, politeness, and tone
 */
@Injectable()
export class CommunicationEvaluation implements EvaluationService {
  constructor(@Inject(AI_SERVICE) private readonly aiService: AiService) {}

  async evaluate(
    context: EvaluationContext,
    next: NextFunction,
  ): Promise<EvaluationResult> {
    if (context.practiceType !== PracticeType.Communication) {
      return next();
    }

    const evaluation = await this.aiService.invoke(
      this.buildPrompt(context),
      CommunicationEvaluationSchema,
    );

    const appropriatenessScore =
      (evaluation.appropriateness.clarity.score +
        evaluation.appropriateness.politeness.score +
        evaluation.appropriateness.tone.score) /
      3;
    const overallScore = (evaluation.correctness.score + appropriatenessScore) / 2;

    return {
      score: overallScore,
      feedback: evaluation.feedback,
      correctness: evaluation.correctness,
      appropriateness: {
        score: appropriatenessScore,
        feedback: evaluation.appropriateness.feedback,
        clarity: evaluation.appropriateness.clarity,
        politeness: evaluation.appropriateness.politeness,
        tone: evaluation.appropriateness.tone,
      },
    };
  }

  private buildPrompt(context: EvaluationContext): string {
    const prompts = context.exercise.prompts;
    const topic = context.exercise.topics.join(', ');
    if (!prompts?.length) throw new Error('Exercise prompt is missing.');

    return `## Task

Review the learner's response and give feedback on correctness and appropriateness.

## Inputs

- **Practice**: Communicate in a real-life conversation.
- **Scenario:** ${context.exercise.scenario ?? 'N/A'}
- **Topic:** "${topic}"
- **Prompt:** "${prompts[0]}"
- **Learner Response:** "${context.response}"`;
  }
}
