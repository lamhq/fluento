import { PracticeExerciseEntity } from './practice-exercise.entity';

export const PRACTICE_EXERCISE_REPOSITORY = Symbol(
  'PracticeExerciseRepository',
);

export type PracticeExerciseSortField = 'lastPracticeAt' | 'createdAt';

export interface PracticeExerciseQuery {
  learnerId: string;
  sort?: PracticeExerciseSortField;
  dir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  topics?: string[];
}

export interface PracticeExerciseRepositoryPort {
  findAll(params: PracticeExerciseQuery): Promise<PracticeExerciseEntity[]>;
  upsertPractice(params: {
    learnerId: string;
    exerciseId: string;
    practicedAt?: Date;
  }): Promise<void>;
}
