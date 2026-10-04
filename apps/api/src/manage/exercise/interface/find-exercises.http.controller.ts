import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../../common/constants';
import type { OffsetPaginationResult } from '../../../common/core/pagination';
import { RequireUser } from '../../../common/interface/require-user.guard';
import { ExerciseService } from '../../../content/core/exercise.service';
import { ExerciseDto } from './exercise.dto';
import { FindExercisesDto } from './find-exercises.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindExercisesDto,
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
