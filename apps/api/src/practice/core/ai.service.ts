import { z } from 'zod';

export const AI_SERVICE = Symbol('AIService');

export interface AiService {
  /**
   * Sends a prompt to the AI model and returns structured response
   * based on the provided Zod response schema
   */
  invoke<T extends z.ZodType>(prompt: string, schema: T): Promise<z.infer<T>>;
}
