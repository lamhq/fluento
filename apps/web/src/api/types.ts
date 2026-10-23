import type { Exercise } from '../core/types/exercise';
import { ExerciseFormat } from '../core/types/exercise-format';
import type { ExerciseSkill } from '../core/types/exercise-skill';
import type { ExerciseStatus } from '../core/types/exercise-status';
import type { ExerciseSummary } from '../core/types/exercise-summary';
import type { PracticeAttempt } from '../core/types/practice-attempt';
import type { PracticeExercise } from '../core/types/practice-exercise';
import type { PracticeExerciseQuery } from '../core/types/practice-exercise-query';
import type { PracticeType } from '../core/types/practice-type';
import type { Topic } from '../core/types/topic';

export interface ApiClient {
  setAccessToken(token: string): void;

  getPracticeExercise(
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginatedResponse<PracticeExercise>>;

  submitPracticeResponse(
    exerciseId: string,
    practiceType: PracticeType,
    response: string,
  ): Promise<PracticeAttempt>;

  getTopics(signal?: AbortSignal): Promise<Topic[]>;

  getExerciseById(exerciseId: string, signal?: AbortSignal): Promise<Exercise>;

  getExercises(
    options?: ExerciseQuery,
    signal?: AbortSignal,
  ): Promise<OffsetPaginatedResponse<ExerciseSummary>>;

  createExercise(input: CreateExerciseInput): Promise<ExerciseSummary>;

  updateExercise(
    exerciseId: string,
    input: UpdateExerciseInput,
  ): Promise<ExerciseSummary>;

  deleteExercise(exerciseId: string): Promise<void>;
}

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

interface CreateExerciseCommonInput {
  topics: string[];
  references?: string[];
  status: ExerciseStatus;
}

export type CreateExerciseInput =
  | (CreateExerciseCommonInput & {
      format: ExerciseFormat.Communication;
      scenario: string;
      prompts: string[];
      validResponses: string[];
    })
  | (CreateExerciseCommonInput & {
      format: ExerciseFormat.Word;
      word: string;
      meaning: string;
      sentences?: string[];
      clues?: string[];
    })
  | (CreateExerciseCommonInput & {
      format: ExerciseFormat.Sentence;
      scenario: string;
      sentence: string;
      words?: string[];
    })
  | (CreateExerciseCommonInput & {
      format: ExerciseFormat.Paragraph;
      scenario: string;
      paragraph: string;
      words?: string[];
    });

export type UpdateExerciseInput = CreateExerciseInput;

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
