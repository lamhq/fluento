import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EXERCISE_REPOSITORY } from './core/exercise.repository';
import { ExerciseService } from './core/exercise.service';
import { PRACTICE_EXERCISE_REPOSITORY } from './core/practice-exercise.repository';
import { PracticeExerciseService } from './core/practice-exercise.service';
import { RESPONSE_EVALUATION_SERVICE } from './core/response-evaluation.service';
import { RESPONSE_SUBMISSION_REPOSITORY } from './core/response-submission.repository';
import { TOPIC_REPOSITORY } from './core/topic.repository';
import { TopicService } from './core/topic.service';
import { MgExerciseRepository } from './infrastructure/mg-exercise.repository';
import { MgPracticeExerciseRepository } from './infrastructure/mg-practice-exercise.repository';
import { MgResponseRepository } from './infrastructure/mg-response.repository';
import { MgTopicRepository } from './infrastructure/mg-topic.repository';
import { OpenAIEvaluationService } from './infrastructure/openai-evaluation.service';
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
import { Topic, TopicSchema } from './infrastructure/schemas/topic.schema';
import { CreateExerciseHttpController } from './interface/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './interface/delete-exercise.http.controller';
import { FindExercisesHttpController } from './interface/find-exercises.http.controller';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises.http.controller';
import { FindTopicsHttpController } from './interface/find-topics.http.controller';
import { GetExerciseHttpController } from './interface/get-exercise.http.controller';
import { SubmitResponseHttpController } from './interface/submit-response.http.controller';
import { UpdateExerciseHttpController } from './interface/update-exercise.http.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: LearnerExercise.name, schema: LearnerExerciseSchema },
      { name: ResponseSubmission.name, schema: ResponseSubmissionSchema },
      { name: Topic.name, schema: TopicSchema },
    ]),
  ],
  controllers: [
    CreateExerciseHttpController,
    FindExercisesHttpController,
    FindPracticeExercisesHttpController,
    FindTopicsHttpController,
    GetExerciseHttpController,
    SubmitResponseHttpController,
    UpdateExerciseHttpController,
    DeleteExerciseHttpController,
  ],
  providers: [
    ExerciseService,
    PracticeExerciseService,
    TopicService,
    MgPracticeExerciseRepository,
    MgExerciseRepository,
    MgTopicRepository,
    MgResponseRepository,
    OpenAIEvaluationService,
    {
      provide: PRACTICE_EXERCISE_REPOSITORY,
      useExisting: MgPracticeExerciseRepository,
    },
    {
      provide: EXERCISE_REPOSITORY,
      useExisting: MgExerciseRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useExisting: MgTopicRepository,
    },
    {
      provide: RESPONSE_SUBMISSION_REPOSITORY,
      useExisting: MgResponseRepository,
    },
    {
      provide: RESPONSE_EVALUATION_SERVICE,
      useExisting: OpenAIEvaluationService,
    },
  ],
})
export class CommModule {}
