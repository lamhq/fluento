import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EXERCISE_REPOSITORY } from './core/exercise.repository';
import { ExerciseService } from './core/exercise.service';
import { TOPIC_REPOSITORY } from './core/topic.repository';
import { TopicService } from './core/topic.service';
import {
  ExerciseModel,
  ExerciseSchema,
} from './infrastructure/exercise.schema';
import { MgExerciseRepository } from './infrastructure/mg-exercise.repository';
import { MgTopicRepository } from './infrastructure/mg-topic.repository';
import { TopicModel, TopicSchema } from './infrastructure/topic.schema';
import { FindTopicsHttpController } from './interface/find-topics.http.controller';

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
