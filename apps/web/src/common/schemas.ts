import { z } from 'zod';

export function createOffsetPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    total: z.number().int().nonnegative(),
    offset: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    items: z.array(itemSchema),
  });
}

export function createCursorPaginatedSchema<T extends z.ZodType>(itemSchema: T) {
  return z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
    previousCursor: z.string().nullable(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
  });
}
