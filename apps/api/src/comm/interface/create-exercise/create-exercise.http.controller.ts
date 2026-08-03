import { Body, Controller, Post } from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { ExerciseResponseDto } from '../exercise-response.dto';
import { CreateExerciseRequestDto } from './create-exercise-request.dto';

@Controller('exercises')
export class CreateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  async create(
    @Body() body: CreateExerciseRequestDto,
  ): Promise<ExerciseResponseDto> {
    return ExerciseResponseDto.fromEntity(
      await this.exerciseService.create(body),
    );
  }
}
