import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CONTEXT_SERVICE, type ContextService } from '../../context/context.service';
import type { CreateExerciseDto } from '../../manage/exercise/interface/create-exercise.dto';
import type { UpdateExerciseDto } from '../../manage/exercise/interface/update-exercise.dto';
import { ExerciseEntity } from './exercise.entity';
import {
  EXERCISE_REPOSITORY,
  type ExerciseQuery,
  type ExerciseRepository,
} from './exercise.repository';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly repository: ExerciseRepository,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async create(data: CreateExerciseDto): Promise<ExerciseEntity> {
    return this.repository.create({
      ...data,
      userId: this.contextService.getUserIdOrThrow(),
    });
  }

  async findAllPaginated(query: Omit<ExerciseQuery, 'userId'> = {}): Promise<{
    total: number;
    offset: number;
    limit: number;
    items: ExerciseEntity[];
  }> {
    // TODO: admin should be able to see all exercises
    const userId = this.contextService.getUserIdOrThrow();
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 10;
    const [total, items] = await this.repository.findAllPaginated({
      ...query,
      userId,
      offset,
      limit,
    });

    return {
      total,
      offset,
      limit,
      items,
    };
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    const exercise = await this.repository.findById(id);

    if (!exercise) {
      return null;
    }

    const userId = this.contextService.getUserIdOrThrow();

    if (exercise.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return exercise;
  }

  async update(id: string, data: UpdateExerciseDto): Promise<ExerciseEntity> {
    const userId = this.contextService.getUserIdOrThrow();
    const exercise = await this.repository.findById(id);

    if (exercise?.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const userId = this.contextService.getUserIdOrThrow();
    const exercise = await this.repository.findById(id);

    if (exercise?.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
