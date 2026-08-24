import { Controller, Delete, Param } from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { ExerciseResponseDto } from '../exercise-response.dto';

@Controller('manage/exercises')
export class DeleteExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ExerciseResponseDto> {
    return ExerciseResponseDto.fromEntity(
      await this.exerciseService.delete(id),
    );
  }
}
