import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard';
import { ApiVersion } from '../../common/http/api-version';
import type { CursorPaginationResult } from '../../common/pagination';
import { PracticeService } from '../core/practice.service';
import type { FindPracticeExercisesDto } from './find-practice-exercises.dto';
import { findPracticeExercisesSchema } from './find-practice-exercises.dto';
import { PracticeExerciseDto } from './practice-exercise.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query({ schema: findPracticeExercisesSchema })
    query: FindPracticeExercisesDto,
  ): Promise<CursorPaginationResult<PracticeExerciseDto>> {
    const { items, nextCursor, previousCursor, hasNext, hasPrevious } =
      await this.practiceService.findExercises(undefined, query);

    return {
      items: items.map((exercise) => PracticeExerciseDto.fromEntity(exercise)),
      nextCursor,
      previousCursor,
      hasNext,
      hasPrevious,
    };
  }
}
