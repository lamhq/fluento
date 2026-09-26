import { Injectable } from '@nestjs/common';
import { createAgent, providerStrategy } from 'langchain';
import { z } from 'zod';

import { ExerciseEntity } from '../../content/core/exercise.entity';
import {
  FeedbackEvaluationSchema,
  type ResponseEvaluationPort,
} from '../core/response-evaluation.port';

@Injectable()
export class OpenAIEvaluationService implements ResponseEvaluationPort {
  async evaluate(
    exercise: ExerciseEntity,
    response: string,
  ): Promise<z.infer<typeof FeedbackEvaluationSchema>> {
    const agent = createAgent({
      model: 'openai:gpt-4.1-nano-2025-04-14',
      tools: [],
      responseFormat: providerStrategy(FeedbackEvaluationSchema),
    });

    const result = await agent.invoke({
      messages: [
        {
          role: 'user',
          content: this.buildEvaluationPrompt(exercise, response),
        },
      ],
    });

    return result.structuredResponse;
  }

  private buildEvaluationPrompt(
    exercise: ExerciseEntity,
    response: string,
  ): string {
    const prompt = exercise.prompts?.[0] ?? '';
    return `## Task

Review the response of an English learner and give feedback for correctness and relevance to the provided scenario.

## Inputs

- **Scenario:** ${exercise.scenario ?? 'N/A'}
- **Prompt:** ${prompt}
- **Learner Response:** "${response}"`;
  }
}
