import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import type { CursorPaginationResult } from '../../common/types/pagination';
import { parseSortStr } from '../../common/utils';
import { ExerciseStatus } from '../core/exercise.entity';
import { PracticeExerciseEntity } from '../core/practice-exercise.entity';
import type { PracticeExerciseQuery } from '../core/practice-exercise.repository';
import { PracticeExerciseRepository } from '../core/practice-exercise.repository';
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
  practicedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MgPracticeExerciseRepository implements PracticeExerciseRepository {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<Exercise>,
    @InjectModel(LearnerExercise.name)
    private readonly learnerExerciseModel: Model<LearnerExercise>,
  ) {}

  /**
   * TODO: implement cursor-based pagination
   */
  async findAllForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginationResult<PracticeExerciseEntity>> {
    const { sort, limit, topics } = query ?? {};
    const safeLimit = Math.min(!limit || limit < 0 ? 10 : limit, 50);
    const pipeline: PipelineStage[] = [
      { $match: { status: ExerciseStatus.Active } },
    ];

    if (topics && topics.length > 0) {
      pipeline.push({ $match: { topics: { $in: topics } } });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'exercise_practices',
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
            { $project: { practiceCount: 1, practicedAt: 1 } },
          ],
          as: 'practiceData',
        },
      },
      {
        $addFields: {
          practiceCount: {
            $ifNull: [{ $arrayElemAt: ['$practiceData.practiceCount', 0] }, 0],
          },
          practicedAt: {
            $ifNull: [{ $arrayElemAt: ['$practiceData.practicedAt', 0] }, null],
          },
        },
      },
      {
        $sort: parseSortStr(sort, [
          'practicedAt',
          'practiceCount',
          'createdAt',
        ]),
      },
      { $limit: safeLimit },
    );

    const results = await this.exerciseModel
      .aggregate<RawPracticeExercise>(pipeline)
      .exec();

    const items = results.map((result) => this.dbModelToEntity(result));

    return {
      items,
      nextCursor: null,
      previousCursor: null,
      hasNext: false,
      hasPrevious: false,
    };
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
            practicedAt,
          },
          $inc: { practiceCount: 1 },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec();
  }

  private isPracticeExercise(data: unknown): data is RawPracticeExercise {
    return (data as { _id?: unknown })._id !== undefined;
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
      practicedAt: item.practicedAt,
      practiceCount: item.practiceCount,
    });
  }
}
