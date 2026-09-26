import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContentModule } from '../content/content.module';
import {
  ExerciseModel,
  ExerciseSchema,
} from '../content/infrastructure/exercise.schema';
import { PracticeService } from './core/practice.service';
import { PRACTICE_ATTEMPT_REPOSITORY } from './core/practice-attempt.repository';
import { PRACTICE_EXERCISE_REPOSITORY } from './core/practice-exercise.repository';
import { RESPONSE_EVALUATION_PORT } from './core/response-evaluation.port';
import { ResponseEvaluationService } from './core/response-evaluation.service';
import {
  LearnerExerciseProgressModel,
  LearnerExerciseProgressSchema,
} from './infrastructure/learner-exercise-progress.schema';
import { MgPracticeAttemptRepository } from './infrastructure/mg-practice-attempt.repository';
import { MgPracticeExerciseRepository } from './infrastructure/mg-practice-exercise.repository';
import { OpenAIEvaluationService } from './infrastructure/openai-evaluation.service';
import {
  PracticeAttemptModel,
  PracticeAttemptSchema,
} from './infrastructure/practice-attempt.schema';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises.http.controller';
import { SubmitResponseHttpController } from './interface/submit-response.http.controller';

@Module({
  imports: [
    ContentModule,
    MongooseModule.forFeature([
      { name: ExerciseModel.name, schema: ExerciseSchema },
      {
        name: LearnerExerciseProgressModel.name,
        schema: LearnerExerciseProgressSchema,
      },
      { name: PracticeAttemptModel.name, schema: PracticeAttemptSchema },
    ]),
  ],
  controllers: [
    FindPracticeExercisesHttpController,
    SubmitResponseHttpController,
  ],
  providers: [
    PracticeService,
    ResponseEvaluationService,
    MgPracticeExerciseRepository,
    MgPracticeAttemptRepository,
    OpenAIEvaluationService,
    {
      provide: PRACTICE_EXERCISE_REPOSITORY,
      useExisting: MgPracticeExerciseRepository,
    },
    {
      provide: PRACTICE_ATTEMPT_REPOSITORY,
      useExisting: MgPracticeAttemptRepository,
    },
    {
      provide: RESPONSE_EVALUATION_PORT,
      useExisting: OpenAIEvaluationService,
    },
  ],
})
export class PracticeModule {}
