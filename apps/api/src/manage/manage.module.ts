import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { CreateExerciseHttpController } from './exercise/interface/create-exercise.http.controller';
import { DeleteExerciseHttpController } from './exercise/interface/delete-exercise.http.controller';
import { FindExercisesHttpController } from './exercise/interface/find-exercises.http.controller';
import { GetExerciseHttpController } from './exercise/interface/get-exercise.http.controller';
import { UpdateExerciseHttpController } from './exercise/interface/update-exercise.http.controller';

@Module({
  imports: [ContentModule],
  controllers: [
    CreateExerciseHttpController,
    FindExercisesHttpController,
    GetExerciseHttpController,
    UpdateExerciseHttpController,
    DeleteExerciseHttpController,
  ],
})
export class ManageModule {}
