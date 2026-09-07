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
import { PracticeExerciseService } from '../core/practice-exercise.service';
import { PracticeExerciseResponseDto } from './practice-exercise-response.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(
    private readonly practiceExerciseService: PracticeExerciseService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('sort') sort?: 'practicedAt' | 'createdAt',
    @Query('after') after?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<CursorPaginationResult<PracticeExerciseResponseDto>> {
    const { items, nextCursor, previousCursor, hasNext, hasPrevious } =
      await this.practiceExerciseService.findAllForUser(undefined, {
        sort,
        limit,
        after,
        topics,
      });

    return {
      items: items.map((exercise) =>
        PracticeExerciseResponseDto.fromEntity(exercise),
      ),
      nextCursor,
      previousCursor,
      hasNext,
      hasPrevious,
    };
  }
}
