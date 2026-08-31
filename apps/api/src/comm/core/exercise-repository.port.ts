import { ExerciseEntity } from './exercise.entity';

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

export interface ExerciseQuery {
  userId?: string;
}

export interface ExerciseRepositoryPort {
  create(data: Omit<ExerciseEntity, 'id'>): Promise<ExerciseEntity>;
  findAll(query: ExerciseQuery): Promise<ExerciseEntity[]>;
  findById(id: string): Promise<ExerciseEntity | null>;
  update(id: string, data: Partial<ExerciseEntity>): Promise<ExerciseEntity>;
  delete(id: string): Promise<ExerciseEntity>;
}
