import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';

import { ExerciseStatus } from '../core/exercise.entity';
import type { PracticeExerciseQuery } from '../core/learner-exercise.repository';
import {
  LearnerExerciseRepository,
  PaginatedPracticeExerciseResult,
} from '../core/learner-exercise.repository';
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
export class MongooseLearnerExerciseRepository implements LearnerExerciseRepository {
  constructor(
    @InjectModel(Exercise.name)
    private readonly exerciseModel: Model<Exercise>,
    @InjectModel(LearnerExercise.name)
    private readonly learnerExerciseModel: Model<LearnerExercise>,
  ) {}

  async findExercisesForUser(
    userId: string,
    query?: PracticeExerciseQuery,
  ): Promise<PaginatedPracticeExerciseResult> {
    const { sort = '-practicedAt', limit = 10, cursor, topics } = query ?? {};

    const matchStage: Record<string, unknown> = {
      status: ExerciseStatus.Active,
    };

    if (topics && topics.length > 0) {
      matchStage.topics = { $in: topics };
    }

    const basePipeline: PipelineStage[] = [
      { $match: matchStage },
      {
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
      },
      {
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
      },
    ];

    const safeLimit = Math.min(limit > 0 ? limit : 10, 50); // Cap at 50
    const sortOrder = this.buildSort(sort);

    // Build keyset pagination filter
    let keysetFilter: Record<string, unknown> = {};
    let cursorData: RawPracticeExercise | null = null;

    if (cursor) {
      try {
        // Fetch the cursor item to get its sort key values
        const cursorItem = await this.exerciseModel.findById(cursor).exec();
        if (cursorItem) {
          // Reconstruct the full item with practice data
          const fullCursorItem = await this.exerciseModel
            .aggregate<RawPracticeExercise>([
              { $match: { _id: new Types.ObjectId(cursor) } },
              ...basePipeline,
            ])
            .exec();
          if (fullCursorItem.length > 0) {
            cursorData = fullCursorItem[0];
          }
        }

        // Build filter to skip past cursor based on sort order
        if (cursorData) {
          keysetFilter = this.buildKeysetFilter(cursorData, sortOrder);
        }
      } catch {
        // Invalid cursor, ignore and start from beginning
        keysetFilter = {};
      }
    }

    // Fetch one extra item to determine if there's a next page
    const fetchLimit = safeLimit + 1;

    const pagePipeline: PipelineStage[] = [
      ...basePipeline,
      ...(Object.keys(keysetFilter).length > 0
        ? [{ $match: keysetFilter }]
        : []),
      { $sort: sortOrder },
      { $limit: fetchLimit },
    ];

    const pageResults = await this.exerciseModel
      .aggregate<RawPracticeExercise>(pagePipeline)
      .exec();
    const results = Array.isArray(pageResults) ? pageResults : [];

    // Determine if there's a next page
    const hasNext = results.length > safeLimit;
    const pageItems = results.slice(0, safeLimit);

    // Build cursors
    let nextCursor: string | null = null;
    if (hasNext && pageItems.length > 0) {
      nextCursor = pageItems[pageItems.length - 1]._id.toString();
    }

    const previousCursor = cursor && pageItems.length > 0 ? cursor : null;

    return {
      items: pageItems.map((result) => this.dbModelToEntity(result)),
      nextCursor,
      previousCursor,
      hasNext,
      hasPrevious: !!cursor,
    };
  }

  private buildKeysetFilter(
    cursorItem: RawPracticeExercise,
    sortOrder: Record<string, 1 | -1>,
  ): Record<string, unknown> {
    const sortFields = Object.entries(sortOrder);
    if (sortFields.length === 0) {
      return {};
    }

    const [primaryField, primaryDirection] = sortFields[0];
    const isDescending = primaryDirection === -1;
    const operator = isDescending ? '$lt' : '$gt';

    // For single-field sort, use simple comparison with ID tiebreaker
    const primaryValue = (cursorItem as unknown as Record<string, unknown>)[
      primaryField
    ];

    return {
      $or: [
        { [primaryField]: { [operator]: primaryValue } },
        {
          $and: [
            { [primaryField]: primaryValue },
            {
              _id: isDescending
                ? { $lt: cursorItem._id }
                : { $gt: cursorItem._id },
            },
          ],
        },
      ],
    };
  }

  private buildSort(sort?: string): Record<string, 1 | -1> {
    const sortEntries = (sort ?? '-practicedAt').split(',').filter(Boolean);
    const fieldMap: Record<string, string> = {
      practicedAt: 'lastPracticeAt',
      lastPracticeAt: 'lastPracticeAt',
      createdAt: 'createdAt',
    };
    const normalized: Record<string, 1 | -1> = {};

    for (const entry of sortEntries) {
      const isDescending = entry.startsWith('-');
      const field = entry.replace(/^-/, '');
      const normalizedField = fieldMap[field] ?? 'lastPracticeAt';
      normalized[normalizedField] = isDescending ? -1 : 1;
    }

    const sortOrder: Record<string, 1 | -1> =
      Object.keys(normalized).length > 0 ? normalized : { lastPracticeAt: -1 };

    // Add `_id` as a deterministic tiebreaker so ties on the primary sort
    // field are ordered consistently with buildKeysetFilter's assumption.
    const primaryDirection = Object.values(sortOrder)[0];
    return { ...sortOrder, _id: primaryDirection };
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
