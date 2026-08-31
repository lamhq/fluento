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
import { CreateExerciseRequestDto } from '../interface/create-exercise-request.dto';
import { UpdateExerciseRequestDto } from '../interface/update-exercise-request.dto';
import { ExerciseEntity } from './exercise.entity';
import {
  EXERCISE_REPOSITORY,
  type ExerciseRepositoryPort,
} from './exercise-repository.port';
import {
  LEARNER_EXERCISE_REPOSITORY,
  type LearnerExerciseRepositoryPort,
  type PaginatedPracticeExerciseResult,
  type PracticeExerciseQuery,
} from './learner-exercise-repository.port';
import {
  RESPONSE_EVALUATION_SERVICE,
  type ResponseEvaluationServicePort,
} from './response-evaluation-service.port';
import { ResponseSubmissionEntity } from './response-submission.entity';
import {
  RESPONSE_SUBMISSION_REPOSITORY,
  type ResponseSubmissionRepositoryPort,
} from './response-submission-repository.port';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY)
    private readonly repository: ExerciseRepositoryPort,
    @Inject(LEARNER_EXERCISE_REPOSITORY)
    private readonly practiceExerciseRepository: LearnerExerciseRepositoryPort,
    @Inject(RESPONSE_SUBMISSION_REPOSITORY)
    private readonly responseSubmissionRepository: ResponseSubmissionRepositoryPort,
    @Inject(RESPONSE_EVALUATION_SERVICE)
    private readonly responseEvaluationService: ResponseEvaluationServicePort,
    @Inject(CONTEXT_SERVICE)
    private readonly contextService: ContextService,
  ) {}

  async create(data: CreateExerciseRequestDto): Promise<ExerciseEntity> {
    return this.repository.create({
      ...data.toEntity(),
      userId: this.contextService.getUserIdOrThrow(),
    });
  }

  async findAllPaginated(
    query: {
      scenario?: string;
      topics?: string[];
      status?: 'active' | 'archived' | 'all';
      sort?: string;
      offset?: number;
      limit?: number;
    } = {},
  ): Promise<{
    total: number;
    offset: number;
    limit: number;
    items: ExerciseEntity[];
  }> {
    // TODO: admin should be able to see all exercises
    const userId = this.contextService.getUserIdOrThrow();
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 10;
    const [total, items] = await this.repository.findAllPaginated({
      ...query,
      userId,
      offset,
      limit,
    });

    return {
      total,
      offset,
      limit,
      items,
    };
  }

  async findExercisesForUser(
    userId?: string,
    query?: PracticeExerciseQuery,
  ): Promise<PaginatedPracticeExerciseResult> {
    const currentUserId = userId ?? this.contextService.getUserIdOrThrow();
    return this.practiceExerciseRepository.findExercisesForUser(
      currentUserId,
      query,
    );
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    const exercise = await this.repository.findById(id);

    if (!exercise) {
      return null;
    }

    const userId = this.contextService.getUserIdOrThrow();

    if (exercise.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return exercise;
  }

  async update(
    id: string,
    data: UpdateExerciseRequestDto,
  ): Promise<ExerciseEntity> {
    const userId = this.contextService.getUserIdOrThrow();
    const exercise = await this.repository.findById(id);

    if (exercise?.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.repository.update(id, data.toEntity());
  }

  async delete(id: string): Promise<ExerciseEntity> {
    const userId = this.contextService.getUserIdOrThrow();
    const exercise = await this.repository.findById(id);

    if (exercise?.userId !== userId) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.repository.delete(id);
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

    const exercise = await this.repository.findById(exerciseId);
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
        userId: userId,
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
