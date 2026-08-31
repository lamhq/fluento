import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
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
