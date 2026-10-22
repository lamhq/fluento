import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../context/context.service.js';
import type { CreateExerciseDto } from '../../manage/exercise/interface/create-exercise.dto.js';
import type { UpdateExerciseDto } from '../../manage/exercise/interface/update-exercise.dto.js';
import { ExerciseEntity, ExerciseFormat, ExerciseSkill } from './exercise.entity.js';
import {
  EXERCISE_REPOSITORY,
  type ExerciseQuery,
  type ExerciseRepository,
} from './exercise.repository.js';
import {
  EXERCISE_TOPICS_CHANGED_EVENT,
  ExerciseTopicsChangedEvent,
} from './exercise-topics-changed.event.js';

function getExerciseMetadata(
  data:
    | { format: ExerciseFormat.Communication; scenario: string }
    | { format: ExerciseFormat.Word; word: string }
    | {
        format: ExerciseFormat.Sentence | ExerciseFormat.Paragraph;
        scenario: string;
      },
): Pick<ExerciseEntity, 'name' | 'skill'> {
  switch (data.format) {
    case ExerciseFormat.Communication:
      return {
        name: data.scenario,
        skill: ExerciseSkill.Communication,
      };
    case ExerciseFormat.Word:
      return {
        name: data.word,
        skill: ExerciseSkill.Vocabulary,
      };
    case ExerciseFormat.Sentence:
    case ExerciseFormat.Paragraph:
      return {
        name: data.scenario,
        skill: ExerciseSkill.Articulation,
      };
    default:
      throw new Error('Unsupported exercise format');
  }
}

@Injectable()
export class ExerciseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly repository: ExerciseRepository,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(data: CreateExerciseDto): Promise<ExerciseEntity> {
    const exercise = await this.repository.create({
      ...data,
      ...getExerciseMetadata(data),
      userId: this.contextService.getUserIdOrThrow(),
    });

    void this.eventEmitter.emitAsync(
      EXERCISE_TOPICS_CHANGED_EVENT,
      new ExerciseTopicsChangedEvent(exercise.userId, exercise.topics),
    );

    return exercise;
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

    const updatedExercise = await this.repository.update(id, {
      ...data,
      ...getExerciseMetadata(data),
    });

    void this.eventEmitter.emitAsync(
      EXERCISE_TOPICS_CHANGED_EVENT,
      new ExerciseTopicsChangedEvent(updatedExercise.userId, updatedExercise.topics),
    );

    return updatedExercise;
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
