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
} from '../../content/core/exercise.repository';
import { PracticeAttemptEntity } from './practice-attempt.entity';
import {
  PRACTICE_ATTEMPT_REPOSITORY,
  type PracticeAttemptRepository,
} from './practice-attempt.repository';
import { PracticeExerciseEntity } from './practice-exercise.entity';
import {
  PRACTICE_EXERCISE_REPOSITORY,
  type PracticeExerciseQuery,
  type PracticeExerciseRepository,
} from './practice-exercise.repository';
import { ResponseEvaluationService } from './response-evaluation.service';

@Injectable()
export class PracticeService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(PRACTICE_EXERCISE_REPOSITORY)
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
    @Inject(PRACTICE_ATTEMPT_REPOSITORY)
    private readonly practiceAttemptRepository: PracticeAttemptRepository,
    private readonly responseEvaluationService: ResponseEvaluationService,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async findExercises(
    userId?: string,
    query?: PracticeExerciseQuery,
  ): Promise<CursorPaginationResult<PracticeExerciseEntity>> {
    const currentUserId = userId ?? this.contextService.getUserIdOrThrow();
    return this.practiceExerciseRepository.findAllForUser(currentUserId, query);
  }

  async submitResponse(
    exerciseId: string,
    response: string,
  ): Promise<PracticeAttemptEntity> {
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

    const submission = await this.practiceAttemptRepository.create(
      new PracticeAttemptEntity({
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
