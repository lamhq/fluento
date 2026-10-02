import { z } from 'zod';

// Avoid `.max()` for string lengths or number ranges
// AI may not receive those constraints, and its output
// can be truncated and incomplete.
export const correctnessSchema = z
  .object({
    score: z.number().describe('Correctness score (0-100).'),
    feedback: z.string().describe('Correctness feedback (max 120 char).'),
    fixes: z
      .array(z.string())
      .describe(
        'List of grammar/spelling fixes or improvements (empty if none are needed).',
      ),
    correctedSentence: z
      .string()
      .describe('Corrected version of the response (empty if no corrections).'),
  })
  .describe(
    "Check spelling & grammar of learner's response. Ignore minor punctuation or capitalization mistakes.",
  );
