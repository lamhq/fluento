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
import type { CursorPaginationResult } from '../../common/types/pagination';
import { PracticeService } from '../core/practice.service';
import { PracticeExerciseDto } from './practice-exercise.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('sort') sort?: 'practicedAt' | 'createdAt',
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<CursorPaginationResult<PracticeExerciseDto>> {
    const { items, nextCursor, previousCursor, hasNext, hasPrevious } =
      await this.practiceService.findExercises(undefined, {
        sort,
        limit,
        topics,
      });

    return {
      items: items.map((exercise) => PracticeExerciseDto.fromEntity(exercise)),
      nextCursor,
      previousCursor,
      hasNext,
      hasPrevious,
    };
  }
}
