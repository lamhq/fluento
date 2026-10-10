import { z } from 'zod';

import {
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity';

const enumValues = (value: Record<string, string>) =>
  Object.values(value).join(', ');

const arrayQuery = <T extends z.ZodType>(itemSchema: T) =>
  z.preprocess(
    (value) => (typeof value === 'string' ? [value] : value),
    z.array(itemSchema),
  );

const nonNegativeInteger = z.preprocess(
  (value) => (value === undefined ? 0 : Number(value)),
  z
    .number({ error: 'offset must be a non-negative integer' })
    .int('offset must be a non-negative integer')
    .min(0, 'offset must be a non-negative integer')
    .max(Number.MAX_SAFE_INTEGER, 'offset must be a non-negative integer'),
);

const positiveInteger = z.preprocess(
  (value) => (value === undefined ? 10 : Number(value)),
  z
    .number({ error: 'limit must be a positive integer' })
    .int('limit must be a positive integer')
    .min(1, 'limit must be a positive integer')
    .max(Number.MAX_SAFE_INTEGER, 'limit must be a positive integer'),
);

export const findExercisesSchema = z.strictObject({
  name: z.string({ error: 'name must be a string' }).optional(),
  topics: arrayQuery(
    z.string({ error: 'topics must contain only string values' }),
  ).optional(),
  skills: arrayQuery(
    z.enum(ExerciseSkill, {
      error: `skills must be one of: ${enumValues(ExerciseSkill)}`,
    }),
  ).optional(),
  formats: arrayQuery(
    z.enum(ExerciseFormat, {
      error: `formats must be one of: ${enumValues(ExerciseFormat)}`,
    }),
  ).optional(),
  status: arrayQuery(
    z.enum(ExerciseStatus, {
      error: `status must be one of: ${enumValues(ExerciseStatus)}`,
    }),
  ).optional(),
  sort: z
    .string({ error: 'sort must be a string' })
    .regex(
      /^(?:-?name(?:,-?createdAt)?|-?createdAt(?:,-?name)?)$/,
      'sort must contain unique name and createdAt fields, optionally prefixed with -',
    )
    .optional(),
  offset: nonNegativeInteger,
  limit: positiveInteger,
});

export type FindExercisesDto = z.output<typeof findExercisesSchema>;
