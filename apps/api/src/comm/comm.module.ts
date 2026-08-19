import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExerciseService } from './core/exercise.service';
import { EXERCISE_REPOSITORY_PORT } from './core/exercise-repository.port';
import { LEARNER_EXERCISE_REPOSITORY_PORT } from './core/learner-exercise-repository.port';
import { ExerciseRepository } from './infrastructure/exercise.repository';
import { LearnerExerciseRepository } from './infrastructure/learner-exercise.repository';
import {
  Exercise,
  ExerciseSchema,
} from './infrastructure/schemas/exercise.schema';
import {
  ExercisePractice,
  ExercisePracticeSchema,
} from './infrastructure/schemas/exercise-practice.schema';
import { CreateExerciseHttpController } from './interface/create-exercise/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './interface/delete-exercise/delete-exercise.http.controller';
import { FindExercisesHttpController } from './interface/find-exercises/find-exercises.http.controller';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises/find-practice-exercises.http.controller';
import { GetExerciseHttpController } from './interface/get-exercise/get-exercise.http.controller';
import { UpdateExerciseHttpController } from './interface/update-exercise/update-exercise.http.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Exercise.name, schema: ExerciseSchema },
      { name: ExercisePractice.name, schema: ExercisePracticeSchema },
    ]),
  ],
  controllers: [
    CreateExerciseHttpController,
    FindExercisesHttpController,
    FindPracticeExercisesHttpController,
    GetExerciseHttpController,
    UpdateExerciseHttpController,
    DeleteExerciseHttpController,
  ],
  providers: [
    ExerciseService,
    LearnerExerciseRepository,
    ExerciseRepository,
    {
      provide: LEARNER_EXERCISE_REPOSITORY_PORT,
      useExisting: LearnerExerciseRepository,
    },
    {
      provide: EXERCISE_REPOSITORY_PORT,
      useExisting: ExerciseRepository,
    },
  ],
})
export class CommModule {}
