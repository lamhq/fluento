import { Inject, Injectable } from '@nestjs/common';

import { CreateExerciseRequestDto } from '../interface/create-exercise/create-exercise-request.dto';
import { UpdateExerciseRequestDto } from '../interface/update-exercise/update-exercise-request.dto';
import { ExerciseEntity } from './exercise.entity';
import {
  EXERCISE_REPOSITORY_PORT,
  type ExerciseRepositoryPort,
} from './exercise-repository.port';
import { PracticeExerciseEntity } from './practice-exercise.entity';
import {
  PRACTICE_EXERCISE_REPOSITORY_PORT,
  type PracticeExerciseQuery,
  type PracticeExerciseRepositoryPort,
} from './practice-exercise-repository.port';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY_PORT)
    private readonly repository: ExerciseRepositoryPort,
    @Inject(PRACTICE_EXERCISE_REPOSITORY_PORT)
    private readonly practiceExerciseRepository: PracticeExerciseRepositoryPort,
  ) {}

  async create(data: CreateExerciseRequestDto): Promise<ExerciseEntity> {
    return this.repository.create(data.toEntity());
  }

  async findAll(): Promise<ExerciseEntity[]> {
    return this.repository.findAll();
  }

  async findPracticeExercises(
    params: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]> {
    return this.practiceExerciseRepository.findAll(params);
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    return this.repository.findById(id);
  }

  async update(
    id: string,
    data: UpdateExerciseRequestDto,
  ): Promise<ExerciseEntity> {
    return this.repository.update(id, data.toEntity());
  }

  async delete(id: string): Promise<ExerciseEntity> {
    return this.repository.delete(id);
  }
}
