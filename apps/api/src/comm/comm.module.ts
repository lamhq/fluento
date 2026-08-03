import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { ExerciseService } from './core/exercise.service';
import { EXERCISE_REPOSITORY_PORT } from './core/exercise-repository.port';
import { ExerciseRepository } from './infrastructure/exercise.repository';
import { CreateExerciseHttpController } from './interface/create-exercise/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './interface/delete-exercise/delete-exercise.http.controller';
import { FindExercisesHttpController } from './interface/find-exercises/find-exercises.http.controller';
import { GetExerciseHttpController } from './interface/get-exercise/get-exercise.http.controller';
import { UpdateExerciseHttpController } from './interface/update-exercise/update-exercise.http.controller';

@Module({
  imports: [PrismaModule],
  controllers: [
    CreateExerciseHttpController,
    FindExercisesHttpController,
    GetExerciseHttpController,
    UpdateExerciseHttpController,
    DeleteExerciseHttpController,
  ],
  providers: [
    ExerciseService,
    ExerciseRepository,
    {
      provide: EXERCISE_REPOSITORY_PORT,
      useExisting: ExerciseRepository,
    },
  ],
})
export class CommModule {}
