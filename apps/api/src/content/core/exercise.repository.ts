import type { Repository } from '../../common/types/repository';
import { ExerciseEntity, ExerciseStatus } from './exercise.entity';

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

export interface ExerciseQuery {
  userId?: string;
  scenario?: string;
  topics?: string[];
  status?: ExerciseStatus;
  sort?: string;
  offset?: number;
  limit?: number;
}

export type ExerciseRepository = Repository<ExerciseEntity, ExerciseQuery>;
