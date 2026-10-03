import type { infer as Infer } from 'zod';

import type {
  practiceAttemptSchema,
  practiceExerciseSchema,
  practiceTypeSchema,
} from './schemas';

export interface ApiClient {
  setAccessToken(token: string): void;

  getPracticeExercise(): Promise<PaginatedResponse<PracticeExercise>>;

  submitPracticeResponse(
    exerciseId: string,
    practiceType: PracticeType,
    response: string,
  ): Promise<PracticeAttempt>;

  getExercises(options?: ExerciseQuery): Promise<[number, Exercise[]]>;
}

export type PracticeType = Infer<typeof practiceTypeSchema>;

export interface ExerciseQuery {
  scenario?: string;
  topics?: string[];
  status?: 'active' | 'archived' | 'all';
  sort?: string;
  offset?: number;
  limit?: number;
}

export type PracticeExercise = Infer<typeof practiceExerciseSchema> & {
  type: PracticeType;
};

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type PracticeAttempt = Infer<typeof practiceAttemptSchema>;

export interface Exercise {
  id: string;
  name: string;
  skill: 'communication' | 'vocabulary' | 'articulation';
  format: 'communication' | 'word' | 'sentence' | 'paragraph';
  scenario?: string;
  paragraph?: string;
  prompts?: string[];
  validResponses?: string[];
  word?: string;
  meaning?: string;
  clues?: string[];
  sentences?: string[];
  words?: string[];
  sentence?: string;
  topics: string[];
  references: string[];
  status: 'active' | 'archived';
}
