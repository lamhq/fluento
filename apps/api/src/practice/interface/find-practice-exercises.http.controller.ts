import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../common/http/api-version.js';
import type { CursorPaginationResult } from '../../common/pagination.js';
import { PracticeService } from '../core/practice.service.js';
import type { FindPracticeExercisesDto } from './find-practice-exercises.dto.js';
import { findPracticeExercisesSchema } from './find-practice-exercises.dto.js';
import { PracticeExerciseDto } from './practice-exercise.dto.js';

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
