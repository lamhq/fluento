import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PracticeAttemptEntity } from '../core/practice-attempt.entity';
import { PracticeAttemptRepository } from '../core/practice-attempt.repository';
import {
  PracticeAttemptDocument,
  PracticeAttemptModel,
} from './practice-attempt.schema';

@Injectable()
export class MgPracticeAttemptRepository implements PracticeAttemptRepository {
  constructor(
    @InjectModel(PracticeAttemptModel.name)
    private readonly practiceAttemptModel: Model<PracticeAttemptModel>,
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
      practiceType: data.practiceType,
      response: data.response,
      score: data.score,
      feedback: data.feedback,
      correctness: data.correctness
        ? {
            score: data.correctness.score,
            feedback: data.correctness.feedback,
            fixes: data.correctness.fixes,
            correctedSentence: data.correctness.correctedSentence,
            sentences: data.correctness.sentences,
          }
        : undefined,
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
