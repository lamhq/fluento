import type { Repository } from '../../common/data/repository';
import {
  ExerciseEntity,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from './exercise.entity';

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

export interface ExerciseQuery {
  userId?: string;
  name?: string;
  topics?: string[];
  skills?: ExerciseSkill[];
  formats?: ExerciseFormat[];
  status?: ExerciseStatus[];
  sort?: string;
  offset?: number;
  limit?: number;
}

export type ExerciseRepository = Repository<ExerciseEntity, ExerciseQuery>;
