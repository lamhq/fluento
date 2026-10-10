import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../../common/http/api-version.js';
import { ExerciseService } from '../../../content/core/exercise.service.js';
import type { CreateExerciseDto } from './create-exercise.dto.js';
import { createExerciseSchema } from './create-exercise.dto.js';
import { ExerciseDto } from './exercise.dto.js';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class CreateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body({ schema: createExerciseSchema })
    body: CreateExerciseDto,
  ): Promise<ExerciseDto> {
    return ExerciseDto.fromEntity(await this.exerciseService.create(body));
  }
}
