import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { ExerciseStatus } from '../core/exercise.entity';
import type { PracticeExerciseQuery } from '../core/learner-exercise-repository.port';
import { LearnerExerciseRepositoryPort } from '../core/learner-exercise-repository.port';
import { PracticeExerciseEntity } from '../core/practice-exercise.entity';
import { Exercise } from './schemas/exercise.schema';
import { LearnerExercise } from './schemas/learner-exercise.schema';

interface RawPracticeExercise {
  _id: Types.ObjectId;
  status: ExerciseStatus;
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: {
    content: string;
    style: string[];
  }[];
  practiceCount: number;
  lastPracticeAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class LearnerExerciseRepository implements LearnerExerciseRepositoryPort {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<Exercise>,
    @InjectModel(LearnerExercise.name)
    private readonly learnerExerciseModel: Model<LearnerExercise>,
  ) {}

  async findExercisesForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]> {
    const {
      sort = 'lastPracticeAt',
      dir = 'asc',
      limit = 20,
      offset = 0,
      topics,
    } = query ?? {};

    const pipeline: PipelineStage[] = [];
    const matchStage: Record<string, unknown> = {
      status: ExerciseStatus.Active,
    };

    if (topics && topics.length > 0) {
      matchStage.topics = { $in: topics };
    }

    pipeline.push({
      $match: matchStage,
    });

    pipeline.push({
      $lookup: {
        from: 'learner_exercise_practices',
        let: { exId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$exerciseId', '$$exId'] },
                  { $eq: ['$userId', new Types.ObjectId(userId)] },
                ],
              },
            },
          },
          { $project: { practiceCount: 1, lastPracticeAt: 1 } },
        ],
        as: 'practiceData',
      },
    });

    pipeline.push({
      $addFields: {
        practiceCount: {
          $ifNull: [{ $arrayElemAt: ['$practiceData.practiceCount', 0] }, 0],
        },
        lastPracticeAt: {
          $ifNull: [
            { $arrayElemAt: ['$practiceData.lastPracticeAt', 0] },
            null,
          ],
        },
      },
    });

    pipeline.push({ $sort: { [sort]: dir === 'asc' ? 1 : -1 } });

    if (offset > 0) {
      pipeline.push({ $skip: offset });
    }

    if (limit > 0) {
      pipeline.push({ $limit: limit });
    }

    const results = await this.exerciseModel.aggregate(pipeline).exec();

    if (!Array.isArray(results)) {
      return [];
    }

    return results.map((result) => this.dbModelToEntity(result));
  }

  async upsertPractice(userId: string, exerciseId: string): Promise<void> {
    const practicedAt = new Date();
    const objectUserId = new Types.ObjectId(userId);
    const objectExerciseId = new Types.ObjectId(exerciseId);

    await this.learnerExerciseModel
      .findOneAndUpdate(
        {
          userId: objectUserId,
          exerciseId: objectExerciseId,
        },
        {
          $set: {
            userId: objectUserId,
            exerciseId: objectExerciseId,
            lastPracticeAt: practicedAt,
          },
          $inc: { practiceCount: 1 },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  private dbModelToEntity(item: unknown): PracticeExerciseEntity {
    if (!this.isPracticeExercise(item)) {
      throw new Error('Invalid database model: missing _id field');
    }

    return new PracticeExerciseEntity({
      id: item._id.toString(),
      status: item.status,
      topics: item.topics,
      scenario: item.scenario,
      learnerRole: item.learnerRole,
      counterpartRole: item.counterpartRole,
      prompts: item.prompts,
      expectedResponses: item.expectedResponses,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      lastPracticeAt: item.lastPracticeAt,
      practiceCount: item.practiceCount,
    });
  }

  private isPracticeExercise(data: unknown): data is RawPracticeExercise {
    return (data as { _id?: unknown })._id !== undefined;
  }
}
