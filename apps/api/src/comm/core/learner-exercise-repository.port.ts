import { PracticeExerciseEntity } from './practice-exercise.entity';

export const LEARNER_EXERCISE_REPOSITORY = Symbol('LearnerExerciseRepository');

export interface PracticeExerciseQuery {
  sort?: string;
  limit?: number;
  cursor?: string;
  offset?: number;
  topics?: string[];
}

export interface PaginatedPracticeExerciseResult {
  items: PracticeExerciseEntity[];
  nextCursor: string | null;
  previousCursor: string | null;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface LearnerExerciseRepositoryPort {
  /*
   * Finds all practice exercises for a given learner with optional filtering and sorting.
   */
  findExercisesForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<PaginatedPracticeExerciseResult>;

  /*
   * Record learner practice for a given exercise.
   */
  upsertPractice(userId: string, exerciseId: string): Promise<void>;
}
