import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { PracticeExerciseResponseDto } from './practice-exercise-response.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async findExercisesForUser(
    @Query('sort') sort?: 'practicedAt' | 'createdAt',
    @Query('cursor') cursor?: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<{
    items: PracticeExerciseResponseDto[];
    pagination: {
      nextCursor: string | null;
      previousCursor: string | null;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  }> {
    const { items, nextCursor, previousCursor, hasNext, hasPrevious } =
      await this.exerciseService.findExercisesForUser(undefined, {
        sort,
        limit,
        cursor,
        topics,
      });

    return {
      items: items.map((exercise) =>
        PracticeExerciseResponseDto.fromEntity(exercise),
      ),
      pagination: {
        nextCursor,
        previousCursor,
        hasNext,
        hasPrevious,
      },
    };
  }
}
