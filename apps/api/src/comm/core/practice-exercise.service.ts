import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../common/core/context.service';
import type { CursorPaginationResult } from '../../common/types/pagination';
import {
  EXERCISE_REPOSITORY,
  type ExerciseRepository,
} from './exercise.repository';
import { PracticeExerciseEntity } from './practice-exercise.entity';
import {
  PRACTICE_EXERCISE_REPOSITORY,
  type PracticeExerciseQuery,
  type PracticeExerciseRepository,
} from './practice-exercise.repository';
import {
  RESPONSE_EVALUATION_SERVICE,
  type ResponseEvaluationService,
} from './response-evaluation.service';
import { ResponseSubmissionEntity } from './response-submission.entity';
import {
  RESPONSE_SUBMISSION_REPOSITORY,
  type ResponseSubmissionRepository,
} from './response-submission.repository';

@Injectable()
export class PracticeExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(PRACTICE_EXERCISE_REPOSITORY)
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
    @Inject(RESPONSE_SUBMISSION_REPOSITORY)
    private readonly responseSubmissionRepository: ResponseSubmissionRepository,
    @Inject(RESPONSE_EVALUATION_SERVICE)
    private readonly responseEvaluationService: ResponseEvaluationService,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async findAllForUser(
    userId?: string,
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginationResult<PracticeExerciseEntity>> {
    const currentUserId = userId ?? this.contextService.getUserIdOrThrow();
    return this.practiceExerciseRepository.findAllForUser(currentUserId, query);
  }

  async submitResponse(
    exerciseId: string,
    response: string,
  ): Promise<ResponseSubmissionEntity> {
    const userId = this.contextService.getUserIdOrThrow();
    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      throw new BadRequestException(
        'Response is required and must not be empty.',
      );
    }

    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${exerciseId} not found`);
    }

    const evaluation = await this.responseEvaluationService.evaluate(
      exercise,
      trimmedResponse,
    );
    const appropriatenessScore =
      (evaluation.appropriateness.clarity.score +
        evaluation.appropriateness.politeness.score +
        evaluation.appropriateness.tone.score) /
      3;
    const overallScore =
      (evaluation.correctness.score + appropriatenessScore) / 2;

    const submission = await this.responseSubmissionRepository.create(
      new ResponseSubmissionEntity({
        userId,
        exerciseId,
        response: trimmedResponse,
        score: overallScore,
        feedback: evaluation.feedback,
        correctness: evaluation.correctness,
        appropriateness: {
          ...evaluation.appropriateness,
          score: appropriatenessScore,
        },
      }),
    );

    await this.practiceExerciseRepository.upsertPractice(userId, exerciseId);

    return submission;
  }
}
