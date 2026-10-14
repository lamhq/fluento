import { z } from 'zod';

export const topicSchema = z.object({
  id: z.string().nonempty(),
  name: z.string().nonempty(),
  createdAt: z.iso.datetime(),
});

export type Topic = z.infer<typeof topicSchema>;
