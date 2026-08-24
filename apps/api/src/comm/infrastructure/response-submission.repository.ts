import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ResponseSubmissionEntity } from '../core/response-submission.entity';
import { ResponseSubmissionRepositoryPort } from '../core/response-submission-repository.port';
import { ResponseSubmission } from './schemas/response-submission.schema';

@Injectable()
export class ResponseSubmissionRepository implements ResponseSubmissionRepositoryPort {
  constructor(
    @InjectModel(ResponseSubmission.name)
    private readonly responseSubmissionModel: Model<ResponseSubmission>,
  ) {}

  async create(
    data: ResponseSubmissionEntity,
  ): Promise<ResponseSubmissionEntity> {
    const created = await this.responseSubmissionModel.create(data);
    return this.dbModelToEntity(created);
  }

  private dbModelToEntity(data: {
    _id: Types.ObjectId;
    learnerId: string;
    exerciseId: string;
    response: string;
    score: number;
    feedback: string;
    correctness: {
      score: number;
      feedback: string;
      fixes: string[];
      correctedSentence: string;
    };
    appropriateness: {
      score: number;
      feedback: string;
      clarity: {
        score: number;
        feedback: string;
      };
      politeness: {
        score: number;
        feedback: string;
      };
      tone: {
        score: number;
        feedback: string;
      };
    };
    alternatives: string[];
    createdAt?: Date;
    updatedAt?: Date;
  }): ResponseSubmissionEntity {
    return new ResponseSubmissionEntity({
      id: data._id.toString(),
      learnerId: data.learnerId,
      exerciseId: data.exerciseId,
      response: data.response,
      score: data.score,
      feedback: data.feedback,
      correctness: data.correctness,
      appropriateness: data.appropriateness,
      alternatives: data.alternatives,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
