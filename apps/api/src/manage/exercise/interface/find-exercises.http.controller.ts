import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../../common/constants';
import { RequireUser } from '../../../common/interface/require-user.guard';
import type { OffsetPaginationResult } from '../../../common/types/pagination';
import { ExerciseStatus } from '../../../content/core/exercise.entity';
import { ExerciseService } from '../../../content/core/exercise.service';
import { ExerciseDto } from './exercise.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('scenario') scenario?: string,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
    @Query('status') status?: ExerciseStatus,
    @Query('sort') sort?: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ): Promise<OffsetPaginationResult<ExerciseDto>> {
    const {
      total,
      items,
      offset: normalizedOffset,
      limit: normalizedLimit,
    } = await this.exerciseService.findAllPaginated({
      scenario,
      topics,
      status,
      sort,
      offset,
      limit,
    });

    return {
      total,
      offset: normalizedOffset,
      limit: normalizedLimit,
      items: items.map((exercise) => ExerciseDto.fromEntity(exercise)),
    };
  }
}
