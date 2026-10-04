import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard';
import { ApiVersion } from '../../../common/http/api-version';
import { ExerciseService } from '../../../content/core/exercise.service';
import { ExerciseDto } from './exercise.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class GetExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<ExerciseDto> {
    const exercise = await this.exerciseService.findById(id);

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return ExerciseDto.fromEntity(exercise);
  }
}
