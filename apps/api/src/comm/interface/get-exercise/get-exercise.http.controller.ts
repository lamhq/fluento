import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { ExerciseResponseDto } from '../exercise-response.dto';

@Controller('exercises')
export class GetExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseService.findById(id);

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return ExerciseResponseDto.fromEntity(exercise);
  }
}
