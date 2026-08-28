import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ResponseSubmissionEntity } from '../core/response-submission.entity';
import { ResponseSubmissionRepositoryPort } from '../core/response-submission-repository.port';
import {
  ResponseSubmission,
  ResponseSubmissionDocument,
} from './schemas/response-submission.schema';

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

  private dbModelToEntity(
    data: ResponseSubmissionDocument,
  ): ResponseSubmissionEntity {
    return new ResponseSubmissionEntity({
      id: data._id.toString(),
      learnerId: data.learnerId,
      exerciseId: data.exerciseId,
      response: data.response,
      score: data.score,
      feedback: data.feedback,
      correctness: data.correctness,
      appropriateness: data.appropriateness,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
