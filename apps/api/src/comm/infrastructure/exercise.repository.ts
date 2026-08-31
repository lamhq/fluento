import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

  async findAll(query: ExerciseQuery): Promise<ExerciseEntity[]> {
    const filter = query.userId ? { userId: query.userId } : {};
    const exercises = await this.exerciseModel.find(filter).exec();
    return exercises.map((exercise) => this.dbModelToEntity(exercise));
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
