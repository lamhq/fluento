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
 * Schema for Communication practice type evaluation
 * Evaluates correctness and appropriateness including clarity, politeness, and tone
 */
const CommunicationEvaluationSchema = z.object({
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
        .describe('Corrected version of the response.'),
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
    const overallScore =
      (evaluation.correctness.score + appropriatenessScore) / 2;

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
    const prompt = context.exercise.prompts?.[0] ?? '';
    return `## Task

Review the learner's response to the conversation prompt and give feedback on correctness and appropriateness (relevant to the scenario).

## Inputs

- **Practice**: Communicate in a real-life conversation.
- **Scenario:** ${context.exercise.scenario ?? 'N/A'}
- **Prompt:** "${prompt}"
- **Learner Response:** "${context.response}"`;
  }
}
