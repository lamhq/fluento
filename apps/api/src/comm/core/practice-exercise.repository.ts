import type { CursorPaginationResult } from '../../common/types/pagination';
import { PracticeExerciseEntity } from './practice-exercise.entity';

export const PRACTICE_EXERCISE_REPOSITORY = Symbol(
  'PracticeExerciseRepository',
);

export interface PracticeExerciseQuery {
  topics?: string[];
  limit?: number;
  after?: string;
  sort?: string;
}

export interface PracticeExerciseRepository {
  /*
   * Finds all practice exercises for a given learner with optional filtering and sorting.
   */
  findAllForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginationResult<PracticeExerciseEntity>>;

  /*
   * Record learner practice for a given exercise.
   */
  upsertPractice(userId: string, exerciseId: string): Promise<void>;
}
