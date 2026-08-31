import { PracticeExerciseEntity } from './practice-exercise.entity';

export const LEARNER_EXERCISE_REPOSITORY = Symbol('LearnerExerciseRepository');

export type PracticeExerciseSortField = 'lastPracticeAt' | 'createdAt';

export interface PracticeExerciseQuery {
  sort?: PracticeExerciseSortField;
  dir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  topics?: string[];
}

export interface LearnerExerciseRepositoryPort {
  /*
   * Finds all practice exercises for a given learner with optional filtering and sorting.
   */
  findExercisesForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]>;

  /*
   * Record learner practice for a given exercise.
   */
  upsertPractice(userId: string, exerciseId: string): Promise<void>;
}
