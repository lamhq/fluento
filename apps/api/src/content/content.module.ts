import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EXERCISE_REPOSITORY } from './core/exercise.repository.js';
import { ExerciseService } from './core/exercise.service.js';
import { TOPIC_REPOSITORY } from './core/topic.repository.js';
import { TopicService } from './core/topic.service.js';
import { ExerciseModel, ExerciseSchema } from './infrastructure/exercise.schema.js';
import { MgExerciseRepository } from './infrastructure/mg-exercise.repository.js';
import { MgTopicRepository } from './infrastructure/mg-topic.repository.js';
import { TopicModel, TopicSchema } from './infrastructure/topic.schema.js';
import { FindTopicsHttpController } from './interface/find-topics.http.controller.js';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExerciseModel.name, schema: ExerciseSchema },
      { name: TopicModel.name, schema: TopicSchema },
    ]),
  ],
  controllers: [FindTopicsHttpController],
  providers: [
    ExerciseService,
    TopicService,
    MgExerciseRepository,
    MgTopicRepository,
    {
      provide: EXERCISE_REPOSITORY,
      useExisting: MgExerciseRepository,
    },
    {
      provide: TOPIC_REPOSITORY,
      useExisting: MgTopicRepository,
    },
  ],
  exports: [ExerciseService, EXERCISE_REPOSITORY],
})
export class ContentModule {}
