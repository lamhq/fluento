import { LearnerExerciseEntity } from './learner-exercise.entity';

export const LEARNER_EXERCISE_REPOSITORY_PORT = Symbol(
  'LearnerExerciseRepositoryPort',
);

export type LearnerExerciseSortField = 'lastPracticeAt' | 'createdAt';

export interface LearnerExerciseQuery {
  learnerId: string;
  sort?: LearnerExerciseSortField;
  dir?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  topics?: string[];
}

export interface LearnerExerciseRepositoryPort {
  findAll(params: LearnerExerciseQuery): Promise<LearnerExerciseEntity[]>;
}
