import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { PracticeExerciseEntity } from '../core/practice-exercise.entity';
import type { PracticeExerciseQuery } from '../core/practice-exercise-repository.port';
import { PracticeExerciseRepositoryPort } from '../core/practice-exercise-repository.port';
import { Exercise } from './schemas/exercise.schema';

interface RawPracticeExercise {
  _id: Types.ObjectId;
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
export class PracticeExerciseRepository implements PracticeExerciseRepositoryPort {
  constructor(
    @InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>,
  ) {}

  async findAll(
    params: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]> {
    const {
      learnerId,
      sort = 'lastPracticeAt',
      dir = 'asc',
      limit = 20,
      offset = 0,
      topics,
    } = params;

    const pipeline: PipelineStage[] = [];

    if (topics && topics.length > 0) {
      pipeline.push({
        $match: { topics: { $in: topics } },
      });
    }

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
                  { $eq: ['$learnerId', new Types.ObjectId(learnerId)] },
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

  async upsertPractice(params: {
    learnerId: string;
    exerciseId: string;
    practicedAt?: Date;
  }): Promise<void> {
    const { learnerId, exerciseId, practicedAt = new Date() } = params;

    await this.exerciseModel.db
      .collection('learner_exercise_practices')
      .updateOne(
        {
          learnerId: new Types.ObjectId(learnerId),
          exerciseId: new Types.ObjectId(exerciseId),
        },
        {
          $set: {
            learnerId: new Types.ObjectId(learnerId),
            exerciseId: new Types.ObjectId(exerciseId),
            lastPracticeAt: practicedAt,
          },
          $inc: { practiceCount: 1 },
        },
        { upsert: true },
      );
  }

  private dbModelToEntity(item: unknown): PracticeExerciseEntity {
    if (!this.isPracticeExercise(item)) {
      throw new Error('Invalid database model: missing _id field');
    }

    return new PracticeExerciseEntity({
      id: item._id.toString(),
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
