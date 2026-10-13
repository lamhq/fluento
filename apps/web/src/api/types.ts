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

  getTopics(signal?: AbortSignal): Promise<Topic[]>;

  getExercises(
    options?: ExerciseQuery,
    signal?: AbortSignal,
  ): Promise<OffsetPaginatedResponse<Exercise>>;

  createExercise(input: CreateExerciseInput): Promise<Exercise>;
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

interface CreateExerciseCommonInput {
  topics: string[];
  references?: string[];
  status: ExerciseStatus;
}

export type CreateExerciseInput =
  | (CreateExerciseCommonInput & {
      format: 'communication';
      scenario: string;
      prompts: string[];
      validResponses: string[];
    })
  | (CreateExerciseCommonInput & {
      format: 'word';
      word: string;
      meaning: string;
      sentences: string[];
      clues: string[];
    })
  | (CreateExerciseCommonInput & {
      format: 'sentence';
      scenario: string;
      sentence: string;
      words: string[];
    })
  | (CreateExerciseCommonInput & {
      format: 'paragraph';
      scenario: string;
      paragraph: string;
      words: string[];
    });

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
