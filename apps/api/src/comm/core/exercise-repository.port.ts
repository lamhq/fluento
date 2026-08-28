import { ExerciseEntity } from './exercise.entity';

export const EXERCISE_REPOSITORY = Symbol('ExerciseRepository');

export interface ExerciseRepositoryPort {
  create(data: ExerciseEntity): Promise<ExerciseEntity>;
  findAll(): Promise<ExerciseEntity[]>;
  findById(id: string): Promise<ExerciseEntity | null>;
  update(id: string, data: Partial<ExerciseEntity>): Promise<ExerciseEntity>;
  delete(id: string): Promise<ExerciseEntity>;
}
