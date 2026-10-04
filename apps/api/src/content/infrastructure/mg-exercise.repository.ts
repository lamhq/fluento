import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, SortOrder, Types } from 'mongoose';

import { ExerciseEntity } from '../core/exercise.entity';
import { ExerciseQuery, ExerciseRepository } from '../core/exercise.repository';
import { ExerciseDocument, ExerciseModel } from './exercise.schema';

@Injectable()
export class MgExerciseRepository implements ExerciseRepository {
  constructor(
    @InjectModel(ExerciseModel.name)
    private readonly exerciseModel: Model<ExerciseModel>,
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
      .skip(query.offset ?? 0)
      .limit(query.limit ?? 10)
      .exec();

    return [total, exercises.map((exercise) => this.dbModelToEntity(exercise))];
  }

  findAll(): Promise<ExerciseEntity[]> {
    throw new Error('Method not implemented.');
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

  async delete(id: string): Promise<void> {
    const deletedExercise = await this.exerciseModel
      .findByIdAndDelete(id)
      .exec();

    if (!deletedExercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }
  }

  private buildFilter(query: ExerciseQuery): FilterQuery<ExerciseEntity> {
    const filter: FilterQuery<ExerciseEntity> = {};

    if (query.userId) {
      filter.userId = new Types.ObjectId(query.userId);
    }

    if (query.status?.length) {
      filter.status = { $in: query.status };
    }

    if (query.name) {
      filter.name = {
        $regex: query.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        $options: 'i',
      };
    }

    if (query.topics && query.topics.length > 0) {
      filter.topics = { $in: query.topics };
    }

    if (query.skills?.length) {
      filter.skill = { $in: query.skills };
    }

    if (query.formats?.length) {
      filter.format = { $in: query.formats };
    }

    return filter;
  }

  private buildSort(sort?: string): Record<string, SortOrder> {
    const sortEntries = (sort ?? 'name').split(',');
    const normalized: Record<string, SortOrder> = {};

    for (const entry of sortEntries) {
      const isDescending = entry.startsWith('-');
      const field = entry.replace(/^-/, '');
      normalized[field] = isDescending ? -1 : 1;
    }

    return normalized;
  }

  private dbModelToEntity(data: ExerciseDocument): ExerciseEntity {
    return new ExerciseEntity({
      id: data._id.toString(),
      userId: data.userId.toString(),
      status: data.status,
      name: data.name,
      skill: data.skill,
      format: data.format,
      topics: data.topics,
      references: data.references,
      scenario: data.scenario,
      paragraph: data.paragraph,
      prompts: data.prompts,
      validResponses: data.validResponses,
      word: data.word,
      meaning: data.meaning,
      clues: data.clues,
      sentences: data.sentences,
      words: data.words,
      sentence: data.sentence,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
