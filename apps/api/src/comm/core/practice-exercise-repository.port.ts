import { PracticeExerciseEntity } from './practice-exercise.entity';

export const PRACTICE_EXERCISE_REPOSITORY = Symbol(
  'PracticeExerciseRepository',
);

export type PracticeExerciseSortField = 'lastPracticeAt' | 'createdAt';

export interface PracticeExerciseQuery {
  sort?: PracticeExerciseSortField;
  dir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  topics?: string[];
}

export interface PracticeExerciseRepositoryPort {
  /*
   * Finds all practice exercises for a given learner with optional filtering and sorting.
   */
  findAll(
    learnerId: string,
    query: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]>;

  /*
   * Record learner practice for a given exercise.
   */
  upsertPractice(userId: string, exerciseId: string): Promise<void>;
}
