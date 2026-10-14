import { z } from 'zod';

export enum ExerciseStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export const exerciseStatusSchema = z.enum(ExerciseStatus);

export const exerciseStatuses: { label: string; value: ExerciseStatus }[] = [
  { label: 'Active', value: ExerciseStatus.ACTIVE },
  { label: 'Archived', value: ExerciseStatus.ARCHIVED },
];
