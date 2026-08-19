import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { LearnerExerciseEntity } from '../core/learner-exercise.entity';
import type { LearnerExerciseQuery } from '../core/learner-exercise-repository.port';
import { LearnerExerciseRepositoryPort } from '../core/learner-exercise-repository.port';
import { Exercise } from './schemas/exercise.schema';

interface RawLearnerExercise {
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
export class LearnerExerciseRepository implements LearnerExerciseRepositoryPort {
  constructor(
    @InjectModel(Exercise.name) private readonly exerciseModel: Model<Exercise>,
  ) {}

  async findAll(
    params: LearnerExerciseQuery,
  ): Promise<LearnerExerciseEntity[]> {
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
                  { $eq: ['$learnerId', learnerId] },
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

  private dbModelToEntity(item: unknown): LearnerExerciseEntity {
    if (!this.isLearnerExercise(item)) {
      throw new Error('Invalid database model: missing _id field');
    }

    return new LearnerExerciseEntity({
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

  private isLearnerExercise(data: unknown): data is RawLearnerExercise {
    return (data as { _id?: unknown })._id !== undefined;
  }
}
