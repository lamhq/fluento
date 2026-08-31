import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { ExerciseEntity } from '../core/exercise.entity';
import {
  ExerciseQuery,
  ExerciseRepositoryPort,
} from '../core/exercise-repository.port';
import { Exercise, ExerciseDocument } from './schemas/exercise.schema';

@Injectable()
export class ExerciseRepository implements ExerciseRepositoryPort {
  constructor(
    @InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>,
  ) {}

  async create(data: ExerciseEntity): Promise<ExerciseEntity> {
    const createdExercise = await this.exerciseModel.create(data);

    return this.dbModelToEntity(createdExercise);
  }

  async findAllPaginated(
    query: ExerciseQuery,
  ): Promise<[number, ExerciseEntity[]]> {
    const filter = this.buildFilter(query);
    const total = await this.exerciseModel.countDocuments(filter).exec();
    const sortableQuery = this.buildSort(query.sort);
    const exercises = await this.exerciseModel
      .find(filter)
      .sort(sortableQuery)
      .skip(Math.max(query.offset ?? 0, 0))
      .limit(Math.max(query.limit ?? 10, 0))
      .exec();

    return [total, exercises.map((exercise) => this.dbModelToEntity(exercise))];
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const exercise = await this.exerciseModel.findById(id).exec();
    return exercise ? this.dbModelToEntity(exercise) : null;
  }

  async update(
    id: string,
    data: Partial<ExerciseEntity>,
  ): Promise<ExerciseEntity> {
    const updatedExercise = await this.exerciseModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();

    if (!updatedExercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.dbModelToEntity(updatedExercise);
  }

  async delete(id: string): Promise<ExerciseEntity> {
    const deletedExercise = await this.exerciseModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedExercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.dbModelToEntity(deletedExercise);
  }

  private buildFilter(query: ExerciseQuery): FilterQuery<Exercise> {
    const filter: FilterQuery<Exercise> = {};

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.scenario) {
      filter.scenario = { $regex: query.scenario, $options: 'i' };
    }

    if (query.topics && query.topics.length > 0) {
      filter.topics = { $in: query.topics };
    }

    return filter;
  }

  private buildSort(sort?: string): Record<string, SortOrder> {
    const sortEntries = (sort ?? '-created-at').split(',').filter(Boolean);
    const fieldMap: Record<string, string> = {
      'created-at': 'createdAt',
      createdAt: 'createdAt',
      status: 'status',
      scenario: 'scenario',
    };
    const normalized: Record<string, SortOrder> = {};

    for (const entry of sortEntries) {
      const isDescending = entry.startsWith('-');
      const field = entry.replace(/^-/, '');
      const normalizedField = fieldMap[field] ?? 'createdAt';
      normalized[normalizedField] = isDescending ? -1 : 1;
    }

    return Object.keys(normalized).length > 0 ? normalized : { createdAt: -1 };
  }

  private dbModelToEntity(data: ExerciseDocument): ExerciseEntity {
    return {
      id: data._id.toString(),
      userId: data.userId,
      status: data.status,
      topics: data.topics,
      scenario: data.scenario,
      learnerRole: data.learnerRole,
      counterpartRole: data.counterpartRole,
      prompts: data.prompts,
      expectedResponses: data.expectedResponses,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
