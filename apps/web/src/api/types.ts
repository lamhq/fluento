import type { infer as Infer } from 'zod';

import type {
  exerciseFormatSchema,
  exerciseSchema,
  exerciseSkillSchema,
  exerciseStatusSchema,
  practiceAttemptSchema,
  practiceExerciseSchema,
  practiceTypeSchema,
} from './schemas';

export interface ApiClient {
  setAccessToken(token: string): void;

  getPracticeExercise(): Promise<CursorPaginatedResponse<PracticeExercise>>;

  submitPracticeResponse(
    exerciseId: string,
    practiceType: PracticeType,
    response: string,
  ): Promise<PracticeAttempt>;

  getExercises(
    options?: ExerciseQuery,
    signal?: AbortSignal,
  ): Promise<OffsetPaginatedResponse<Exercise>>;
  getTopics(signal?: AbortSignal): Promise<Topic[]>;
}

export type PracticeType = Infer<typeof practiceTypeSchema>;

export interface ExerciseQuery {
  name?: string;
  topics?: string[];
  skills?: ExerciseSkill[];
  formats?: ExerciseFormat[];
  status?: ExerciseStatus[];
  sort?: string;
  offset?: number;
  limit?: number;
}

export type ExerciseSkill = Infer<typeof exerciseSkillSchema>;

export type ExerciseFormat = Infer<typeof exerciseFormatSchema>;

export type ExerciseStatus = Infer<typeof exerciseStatusSchema>;

export type Exercise = Infer<typeof exerciseSchema>;

export interface Topic {
  id: string;
  name: string;
  createdAt: string;
}

export type PracticeExercise = Infer<typeof practiceExerciseSchema> & {
  type: PracticeType;
};

export interface OffsetPaginatedResponse<T> {
  total: number;
  offset: number;
  limit: number;
  items: T[];
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type PracticeAttempt = Infer<typeof practiceAttemptSchema>;
