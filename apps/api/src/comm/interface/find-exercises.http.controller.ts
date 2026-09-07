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

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import type { OffsetPaginationResult } from '../../common/types/pagination';
import { ExerciseService } from '../core/exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('scenario') scenario?: string,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
    @Query('status') status?: 'active' | 'archived' | 'all',
    @Query('sort') sort?: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ): Promise<OffsetPaginationResult<ExerciseResponseDto>> {
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
      items: items.map((exercise) => ExerciseResponseDto.fromEntity(exercise)),
    };
  }
}
