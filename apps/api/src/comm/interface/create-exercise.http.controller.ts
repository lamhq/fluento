import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { CreateExerciseRequestDto } from './create-exercise-request.dto';
import { ExerciseResponseDto } from './exercise-response.dto';

@Controller('manage/exercises')
@UseGuards(RequireUser)
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
