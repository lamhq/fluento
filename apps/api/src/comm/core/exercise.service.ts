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
  EXERCISE_REPOSITORY_PORT,
  type ExerciseRepositoryPort,
} from './exercise-repository.port';
import { PracticeExerciseEntity } from './practice-exercise.entity';
import {
  PRACTICE_EXERCISE_REPOSITORY_PORT,
  type PracticeExerciseQuery,
  type PracticeExerciseRepositoryPort,
} from './practice-exercise-repository.port';
import { ResponseSubmissionEntity } from './response-submission.entity';
import {
  RESPONSE_SUBMISSION_REPOSITORY_PORT,
  type ResponseSubmissionRepositoryPort,
} from './response-submission-repository.port';

@Injectable()
export class ExerciseService {
  constructor(
    @Inject(EXERCISE_REPOSITORY_PORT)
    private readonly repository: ExerciseRepositoryPort,
    @Inject(PRACTICE_EXERCISE_REPOSITORY_PORT)
    private readonly practiceExerciseRepository: PracticeExerciseRepositoryPort,
    @Inject(RESPONSE_SUBMISSION_REPOSITORY_PORT)
    private readonly responseSubmissionRepository: ResponseSubmissionRepositoryPort,
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

    const evaluation = this.evaluateResponse(exercise, trimmedResponse);

    const submission = await this.responseSubmissionRepository.create(
      new ResponseSubmissionEntity({
        learnerId,
        exerciseId,
        response: trimmedResponse,
        score: evaluation.score,
        feedback: evaluation.feedback,
        correctness: evaluation.correctness,
        appropriateness: evaluation.appropriateness,
        alternatives: evaluation.alternatives,
      }),
    );

    await this.practiceExerciseRepository.upsertPractice({
      learnerId,
      exerciseId,
    });

    return submission;
  }

  private evaluateResponse(
    _exercise: ExerciseEntity,
    _response: string,
  ): Omit<
    ResponseSubmissionEntity,
    'id' | 'learnerId' | 'exerciseId' | 'response' | 'createdAt' | 'updatedAt'
  > {
    return {
      score: 95,
      feedback:
        'Excellent work. Your response is clear, polite, and appropriate for the scenario.',
      correctness: {
        score: 95,
        feedback:
          'Your response is grammatically correct, with one minor contraction improvement.',
        fixes: ["Use the contraction form: 'Let's' instead of 'Lets'."],
        correctedSentence: "Let's meet tomorrow to discuss the project.",
      },
      appropriateness: {
        score: 95,
        feedback:
          'The response is relevant to the prompt and matches the tone expected in the scenario.',
        clarity: {
          score: 96,
          feedback: 'The message is easy to understand and free of ambiguity.',
        },
        politeness: {
          score: 97,
          feedback:
            'The response shows courtesy and respects the other person.',
        },
        tone: {
          score: 94,
          feedback:
            'The tone is friendly and appropriate for a conversation in this context.',
        },
      },
      alternatives: [
        "I'd be happy to meet tomorrow to talk about the project.",
        "Tomorrow works well for me. Let's discuss the details then.",
        "Sure, let's meet tomorrow to go over the project.",
      ],
    };
  }
}
