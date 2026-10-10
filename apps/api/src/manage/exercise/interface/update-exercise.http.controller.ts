import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../../common/http/api-version.js';
import { ExerciseService } from '../../../content/core/exercise.service.js';
import { ExerciseDto } from './exercise.dto.js';
import type { UpdateExerciseDto } from './update-exercise.dto.js';
import { updateExerciseSchema } from './update-exercise.dto.js';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class UpdateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body({ schema: updateExerciseSchema })
    body: UpdateExerciseDto,
  ): Promise<ExerciseDto> {
    return ExerciseDto.fromEntity(await this.exerciseService.update(id, body));
  }
}
