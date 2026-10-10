import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../../common/http/api-version.js';
import type { OffsetPaginationResult } from '../../../common/pagination.js';
import { ExerciseService } from '../../../content/core/exercise.service.js';
import { ExerciseDto } from './exercise.dto.js';
import type { FindExercisesDto } from './find-exercises.dto.js';
import { findExercisesSchema } from './find-exercises.dto.js';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query({ schema: findExercisesSchema })
    query: FindExercisesDto,
  ): Promise<OffsetPaginationResult<ExerciseDto>> {
    const { total, items, offset, limit } =
      await this.exerciseService.findAllPaginated(query);

    return {
      total,
      offset,
      limit,
      items: items.map((exercise) => ExerciseDto.fromEntity(exercise)),
    };
  }
}
