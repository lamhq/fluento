import { Controller, Get, UseGuards } from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async findAll(): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseService.findAll();
    return exercises.map((exercise) =>
      ExerciseResponseDto.fromEntity(exercise),
    );
  }
}
