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

import { RequireUser } from '../../common/auth/require-user.guard';
import { ApiVersion } from '../../common/http/api-version';
import type { CursorPaginationResult } from '../../common/pagination';
import { PracticeService } from '../core/practice.service';
import { PracticeExerciseQuery } from '../core/practice-exercise.repository';
import { PracticeExerciseDto } from './practice-exercise.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('sort') sort?: PracticeExerciseQuery['sort'],
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
