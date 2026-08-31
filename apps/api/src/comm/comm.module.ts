import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EXERCISE_REPOSITORY } from './core/exercise.repository';
import { ExerciseService } from './core/exercise.service';
import { LEARNER_EXERCISE_REPOSITORY } from './core/learner-exercise.repository';
import { RESPONSE_EVALUATION_SERVICE } from './core/response-evaluation.service';
import { RESPONSE_SUBMISSION_REPOSITORY } from './core/response-submission.repository';
import { TOPIC_REPOSITORY } from './core/topic.repository';
import { TopicService } from './core/topic.service';
import { MongooseExerciseRepository } from './infrastructure/mongoose-exercise.repository';
import { MongooseLearnerExerciseRepository } from './infrastructure/mongoose-learner-exercise.repository';
import { MongooseResponseRepository } from './infrastructure/mongoose-response.repository';
import { MongooseTopicRepository } from './infrastructure/mongoose-topic.repository';
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
    TopicService,
    MongooseLearnerExerciseRepository,
    MongooseExerciseRepository,
    MongooseTopicRepository,
    MongooseResponseRepository,
    OpenAIEvaluationService,
    {
      provide: LEARNER_EXERCISE_REPOSITORY,
      useExisting: MongooseLearnerExerciseRepository,
    },
    {
      provide: EXERCISE_REPOSITORY,
      useExisting: MongooseExerciseRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useExisting: MongooseTopicRepository,
    },
    {
      provide: RESPONSE_SUBMISSION_REPOSITORY,
      useExisting: MongooseResponseRepository,
    },
    {
      provide: RESPONSE_EVALUATION_SERVICE,
      useExisting: OpenAIEvaluationService,
    },
  ],
})
export class CommModule {}
