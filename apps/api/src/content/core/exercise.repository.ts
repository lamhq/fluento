import type { Repository } from '../../common/types/repository';
import { ExerciseEntity } from './exercise.entity';

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

export interface ExerciseQuery {
  userId?: string;
  scenario?: string;
  topics?: string[];
  status?: 'active' | 'archived' | 'all';
  sort?: string;
  offset?: number;
  limit?: number;
}

export type ExerciseRepository = Repository<ExerciseEntity, ExerciseQuery>;
