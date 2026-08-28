import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExerciseService } from './core/exercise.service';
import { EXERCISE_REPOSITORY } from './core/exercise-repository.port';
import { PRACTICE_EXERCISE_REPOSITORY } from './core/practice-exercise-repository.port';
import { RESPONSE_EVALUATION_SERVICE } from './core/response-evaluation-service.port';
import { RESPONSE_SUBMISSION_REPOSITORY } from './core/response-submission-repository.port';
import { ExerciseRepository } from './infrastructure/exercise.repository';
import { PracticeExerciseRepository } from './infrastructure/practice-exercise.repository';
import { ResponseEvaluationService } from './infrastructure/response-evaluation.service';
import { ResponseSubmissionRepository } from './infrastructure/response-submission.repository';
import {
  Exercise,
  ExerciseSchema,
} from './infrastructure/schemas/exercise.schema';
import {
  LearnerExercise,
  LearnerExerciseSchema,
} from './infrastructure/schemas/learner-exercise.schema';
import {
  ResponseSubmission,
  ResponseSubmissionSchema,
} from './infrastructure/schemas/response-submission.schema';
import { CreateExerciseHttpController } from './interface/create-exercise/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './interface/delete-exercise/delete-exercise.http.controller';
import { FindExercisesHttpController } from './interface/find-exercises/find-exercises.http.controller';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises/find-practice-exercises.http.controller';
import { GetExerciseHttpController } from './interface/get-exercise/get-exercise.http.controller';
import { SubmitResponseHttpController } from './interface/submit-response/submit-response.http.controller';
import { UpdateExerciseHttpController } from './interface/update-exercise/update-exercise.http.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: LearnerExercise.name, schema: LearnerExerciseSchema },
      { name: ResponseSubmission.name, schema: ResponseSubmissionSchema },
    ]),
  ],
  controllers: [
    CreateExerciseHttpController,
    FindExercisesHttpController,
    FindPracticeExercisesHttpController,
    GetExerciseHttpController,
    SubmitResponseHttpController,
    UpdateExerciseHttpController,
    DeleteExerciseHttpController,
  ],
  providers: [
    ExerciseService,
    PracticeExerciseRepository,
    ExerciseRepository,
    ResponseSubmissionRepository,
    ResponseEvaluationService,
    {
      provide: PRACTICE_EXERCISE_REPOSITORY,
      useExisting: PracticeExerciseRepository,
    },
    {
      provide: EXERCISE_REPOSITORY,
      useExisting: ExerciseRepository,
    },
    {
      provide: RESPONSE_SUBMISSION_REPOSITORY,
      useExisting: ResponseSubmissionRepository,
    },
    {
      provide: RESPONSE_EVALUATION_SERVICE,
      useExisting: ResponseEvaluationService,
    },
  ],
})
export class CommModule {}
