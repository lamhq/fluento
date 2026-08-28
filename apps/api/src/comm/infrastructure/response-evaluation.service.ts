import { Injectable } from '@nestjs/common';
import { createAgent, providerStrategy } from 'langchain';
import { z } from 'zod';

import { ExerciseEntity } from '../core/exercise.entity';
import {
  FeedbackEvaluationSchema,
  type ResponseEvaluationServicePort,
} from '../core/response-evaluation-service.port';

@Injectable()
export class ResponseEvaluationService implements ResponseEvaluationServicePort {
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
    const prompt = exercise.prompts[0];
    return `## Task

Review the response of an English learner and give feedback for correctness and relevance to the provided scenario.

## Inputs

- **Scenario:** ${exercise.scenario}
- **Learner Role:** ${exercise.learnerRole}
- **Counterpart Role:** ${exercise.counterpartRole}
- **Prompt:** ${prompt}
- **Learner Response:** "${response}"`;
  }
}
