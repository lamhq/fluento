import { Inject, Injectable } from '@nestjs/common';

import { ExerciseEntity } from '../../content/core/exercise.entity';
import {
  type FeedbackEvaluation,
  RESPONSE_EVALUATION_PORT,
  type ResponseEvaluationPort,
} from './response-evaluation.port';

@Injectable()
export class ResponseEvaluationService {
  constructor(
    @Inject(RESPONSE_EVALUATION_PORT)
    private readonly evaluationPort: ResponseEvaluationPort,
  ) {}

  evaluate(
    exercise: ExerciseEntity,
    response: string,
  ): Promise<FeedbackEvaluation> {
    return this.evaluationPort.evaluate(exercise, response);
  }
}
