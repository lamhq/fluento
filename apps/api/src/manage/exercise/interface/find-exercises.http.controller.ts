import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard';
import { ApiVersion } from '../../../common/http/api-version';
import type { OffsetPaginationResult } from '../../../common/pagination';
import { ExerciseService } from '../../../content/core/exercise.service';
import { ExerciseDto } from './exercise.dto';
import type { FindExercisesDto } from './find-exercises.dto';
import { findExercisesSchema } from './find-exercises.dto';

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
