import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { CursorPaginationResult } from '../../common/pagination.js';
import { ExerciseFormat } from '../../content/core/exercise.entity.js';
import {
  EXERCISE_REPOSITORY,
  type ExerciseRepository,
} from '../../content/core/exercise.repository.js';
import {
  CONTEXT_SERVICE,
  type ContextService,
} from '../../context/context.service.js';
import { EvaluationChain } from './evaluation-chain.js';
import { PracticeAttemptEntity } from './practice-attempt.entity.js';
import {
  PRACTICE_ATTEMPT_REPOSITORY,
  type PracticeAttemptRepository,
} from './practice-attempt.repository.js';
import { PracticeExerciseEntity } from './practice-exercise.entity.js';
import {
  PRACTICE_EXERCISE_REPOSITORY,
  type PracticeExerciseQuery,
  type PracticeExerciseRepository,
} from './practice-exercise.repository.js';
import { PracticeType } from './types.js';

const PRACTICE_TYPE_FORMAT_MAP: Record<PracticeType, ExerciseFormat[]> = {
  [PracticeType.Communication]: [ExerciseFormat.Communication],
  [PracticeType.UsingWord]: [ExerciseFormat.Word],
  [PracticeType.JustOneWord]: [ExerciseFormat.Word],
  [PracticeType.WordGuessing]: [ExerciseFormat.Word],
  [PracticeType.SentenceConstruction]: [ExerciseFormat.Sentence],
  [PracticeType.SentenceVariation]: [ExerciseFormat.Sentence],
  [PracticeType.ParagraphVariation]: [ExerciseFormat.Paragraph],
};

@Injectable()
export class PracticeService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly exerciseRepository: ExerciseRepository,
    @Inject(PRACTICE_EXERCISE_REPOSITORY)
    private readonly practiceExerciseRepository: PracticeExerciseRepository,
    @Inject(PRACTICE_ATTEMPT_REPOSITORY)
    private readonly practiceAttemptRepository: PracticeAttemptRepository,
    private readonly evaluationChain: EvaluationChain,
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
    practiceType: PracticeType,
    response: string,
  ): Promise<PracticeAttemptEntity> {
    const userId = this.contextService.getUserIdOrThrow();
    const trimmedResponse = response.trim();
    if (!trimmedResponse) {
      throw new BadRequestException('Response is required and must not be empty.');
    }

    const exercise = await this.exerciseRepository.findById(exerciseId);
    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${exerciseId} not found`);
    }

    // Validate that practiceType is compatible with exercise format
    const allowedFormats = PRACTICE_TYPE_FORMAT_MAP[practiceType];
    if (!allowedFormats.includes(exercise.format)) {
      throw new BadRequestException(
        `Practice type '${practiceType}' is not compatible with exercise format '${exercise.format}'.`,
      );
    }

    // Execute evaluation chain
    const evaluationResult = await this.evaluationChain.evaluate({
      exercise,
      response: trimmedResponse,
      practiceType,
    });

    if (!evaluationResult) {
      throw new Error(`Evaluation failed for practice type: ${practiceType}`);
    }

    // Create practice attempt with evaluation result
    const submission = await this.practiceAttemptRepository.create(
      new PracticeAttemptEntity({
        userId,
        exerciseId,
        practiceType,
        response: trimmedResponse,
        score: evaluationResult.score,
        feedback: evaluationResult.feedback,
        correctness: evaluationResult.correctness,
        appropriateness: evaluationResult.appropriateness,
      }),
    );

    await this.practiceExerciseRepository.upsertPractice(userId, exerciseId);

    return submission;
  }
}
