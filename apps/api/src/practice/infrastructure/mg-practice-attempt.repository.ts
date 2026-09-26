import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PracticeAttemptEntity } from '../core/practice-attempt.entity';
import { PracticeAttemptRepository } from '../core/practice-attempt.repository';
import {
  PracticeAttempt,
  PracticeAttemptDocument,
} from './practice-attempt.schema';

@Injectable()
export class MgPracticeAttemptRepository implements PracticeAttemptRepository {
  constructor(
    @InjectModel(PracticeAttempt.name)
    private readonly practiceAttemptModel: Model<PracticeAttempt>,
  ) {}

  async create(data: PracticeAttemptEntity): Promise<PracticeAttemptEntity> {
    const created = await this.practiceAttemptModel.create(data);
    return this.dbModelToEntity(created);
  }

  private dbModelToEntity(
    data: PracticeAttemptDocument,
  ): PracticeAttemptEntity {
    return new PracticeAttemptEntity({
      id: data._id.toString(),
      userId: data.userId.toString(),
      exerciseId: data.exerciseId.toString(),
      response: data.response,
      score: data.score,
      feedback: data.feedback,
      correctness: {
        score: data.correctness.score,
        feedback: data.correctness.feedback,
        fixes: data.correctness.fixes,
        correctedResponse: data.correctness.correctedResponse,
      },
      appropriateness: data.appropriateness
        ? {
            score: data.appropriateness.score,
            feedback: data.appropriateness.feedback,
            clarity: data.appropriateness.clarity,
            politeness: data.appropriateness.politeness,
            tone: data.appropriateness.tone,
          }
        : undefined,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
