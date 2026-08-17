import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ExerciseService } from './core/exercise.service';
import { EXERCISE_REPOSITORY_PORT } from './core/exercise-repository.port';
import { LEARNER_EXERCISE_REPOSITORY_PORT } from './core/learner-exercise-repository.port';
import { ExerciseRepository } from './infrastructure/exercise.repository';
import { LearnerExerciseRepository } from './infrastructure/learner-exercise.repository';
import { CreateExerciseHttpController } from './interface/create-exercise/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './interface/delete-exercise/delete-exercise.http.controller';
import { FindExercisesHttpController } from './interface/find-exercises/find-exercises.http.controller';
import { FindPracticeExercisesHttpController } from './interface/find-practice-exercises/find-practice-exercises.http.controller';
import { GetExerciseHttpController } from './interface/get-exercise/get-exercise.http.controller';
import { UpdateExerciseHttpController } from './interface/update-exercise/update-exercise.http.controller';

@Module({
  imports: [PrismaModule],
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
