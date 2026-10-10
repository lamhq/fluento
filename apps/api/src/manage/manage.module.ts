import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module.js';
import { CreateExerciseHttpController } from './exercise/interface/create-exercise.http.controller.js';
import { DeleteExerciseHttpController } from './exercise/interface/delete-exercise.http.controller.js';
import { FindExercisesHttpController } from './exercise/interface/find-exercises.http.controller.js';
import { GetExerciseHttpController } from './exercise/interface/get-exercise.http.controller.js';
import { UpdateExerciseHttpController } from './exercise/interface/update-exercise.http.controller.js';

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
