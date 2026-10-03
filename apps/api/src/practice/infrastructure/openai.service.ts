import { Injectable } from '@nestjs/common';
import { createAgent, providerStrategy } from 'langchain';
import { z } from 'zod';

import { type AiService } from '../core/ai.service';

@Injectable()
export class OpenAiService implements AiService {
  async invoke<T extends z.ZodType>(
    prompt: string,
    schema: T,
  ): Promise<z.infer<T>> {
    const agent = createAgent({
      model: 'openai:gpt-4.1-nano-2025-04-14',
      tools: [],
      responseFormat: providerStrategy(schema),
    });

    const result = await agent.invoke({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return result.structuredResponse as z.infer<T>;
  }
}
