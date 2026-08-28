import { Controller, Get } from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { ExerciseResponseDto } from '../exercise-response.dto';

@Controller('manage/exercises')
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
