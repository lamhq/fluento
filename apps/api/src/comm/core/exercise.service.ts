import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateExerciseRequestDto } from '../interface/create-exercise/create-exercise-request.dto';
import { UpdateExerciseRequestDto } from '../interface/update-exercise/update-exercise-request.dto';
import { ExerciseEntity } from './exercise.entity';
import {
  EXERCISE_REPOSITORY,
  type ExerciseRepositoryPort,
} from './exercise-repository.port';
import { PracticeExerciseEntity } from './practice-exercise.entity';
import {
  PRACTICE_EXERCISE_REPOSITORY,
  type PracticeExerciseQuery,
  type PracticeExerciseRepositoryPort,
} from './practice-exercise-repository.port';
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
    @Inject(PRACTICE_EXERCISE_REPOSITORY)
    private readonly practiceExerciseRepository: PracticeExerciseRepositoryPort,
    @Inject(RESPONSE_SUBMISSION_REPOSITORY)
    private readonly responseSubmissionRepository: ResponseSubmissionRepositoryPort,
    @Inject(RESPONSE_EVALUATION_SERVICE)
    private readonly responseEvaluationService: ResponseEvaluationServicePort,
  ) {}

  async create(data: CreateExerciseRequestDto): Promise<ExerciseEntity> {
    return this.repository.create(data.toEntity());
  }

  async findAll(): Promise<ExerciseEntity[]> {
    return this.repository.findAll();
  }

  async findPracticeExercises(
    params: PracticeExerciseQuery,
  ): Promise<PracticeExerciseEntity[]> {
    return this.practiceExerciseRepository.findAll(params);
  }

  async findById(id: string): Promise<ExerciseEntity | null> {
    return this.repository.findById(id);
  }

  async update(
    id: string,
    data: UpdateExerciseRequestDto,
  ): Promise<ExerciseEntity> {
    return this.repository.update(id, data.toEntity());
  }

  async delete(id: string): Promise<ExerciseEntity> {
    return this.repository.delete(id);
  }

  async submitResponse(
    exerciseId: string,
    learnerId: string,
    response: string,
  ): Promise<ResponseSubmissionEntity> {
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
        learnerId,
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

    await this.practiceExerciseRepository.upsertPractice({
      learnerId,
      exerciseId,
    });

    return submission;
  }
}
