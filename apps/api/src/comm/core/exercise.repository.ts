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

export interface ExerciseRepository {
  create(data: Omit<ExerciseEntity, 'id'>): Promise<ExerciseEntity>;
  findAllPaginated(query: ExerciseQuery): Promise<[number, ExerciseEntity[]]>;
  findById(id: string): Promise<ExerciseEntity | null>;
  update(id: string, data: Partial<ExerciseEntity>): Promise<ExerciseEntity>;
  delete(id: string): Promise<ExerciseEntity>;
}
