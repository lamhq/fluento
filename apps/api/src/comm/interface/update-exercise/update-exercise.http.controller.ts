import { Body, Controller, Param, Patch } from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { ExerciseResponseDto } from '../exercise-response.dto';
import { UpdateExerciseRequestDto } from './update-exercise-request.dto';

@Controller('manage/exercises')
export class UpdateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExerciseRequestDto,
  ): Promise<ExerciseResponseDto> {
    return ExerciseResponseDto.fromEntity(
      await this.exerciseService.update(id, body),
    );
  }
}
