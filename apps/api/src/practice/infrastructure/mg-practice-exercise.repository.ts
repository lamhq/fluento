import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import type { CursorPaginationResult } from '../../common/types/pagination';
import { parseSortStr } from '../../common/utils';
import {
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../content/core/exercise.entity';
import { ExerciseModel } from '../../content/infrastructure/exercise.schema';
import { ExerciseView } from '../core/exercise.view';
import type { PracticeExerciseQuery } from '../core/practice-exercise.repository';
import { PracticeExerciseRepository } from '../core/practice-exercise.repository';
import { LearnerExerciseProgressModel } from './learner-exercise-progress.schema';

interface RawPracticeExercise {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  status: string;
  name: string;
  skill: string;
  format: string;
  topics: string[];
  references: string[];
  scenario?: string;
  paragraph?: string;
  prompts: string[];
  validResponses: string[];
  word?: string;
  meaning?: string;
  clues: string[];
  sentences: string[];
  words: string[];
  practiceCount: number;
  practicedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class MgPracticeExerciseRepository implements PracticeExerciseRepository {
  constructor(
    @InjectModel(ExerciseModel.name)
    private readonly exerciseModel: Model<ExerciseModel>,
    @InjectModel(LearnerExerciseProgressModel.name)
    private readonly learnerExerciseModel: Model<LearnerExerciseProgressModel>,
  ) {}

  /**
   * TODO: implement cursor-based pagination
   */
  async findAllForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginationResult<ExerciseView>> {
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
          from: this.learnerExerciseModel.collection.name,
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

  private dbModelToEntity(item: unknown): ExerciseView {
    if (!this.isPracticeExercise(item)) {
      throw new Error('Invalid database model: missing _id field');
    }

    return new ExerciseView({
      id: item._id.toString(),
      userId: item.userId.toString(),
      status: item.status as ExerciseStatus,
      name: item.name,
      skill: item.skill as ExerciseSkill,
      format: item.format as ExerciseFormat,
      topics: item.topics,
      references: item.references,
      scenario: item.scenario,
      paragraph: item.paragraph,
      prompts: item.prompts,
      validResponses: item.validResponses,
      word: item.word,
      meaning: item.meaning,
      clues: item.clues,
      sentences: item.sentences,
      words: item.words,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      practicedAt: item.practicedAt ?? undefined,
      practiceCount: item.practiceCount,
    });
  }
}
