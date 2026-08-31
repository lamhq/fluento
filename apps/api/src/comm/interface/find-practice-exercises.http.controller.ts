import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { PracticeExerciseResponseDto } from './practice-exercise-response.dto';

@Controller('practice/exercises')
@UseGuards(RequireUser)
export class FindPracticeExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get()
  async findExercisesForUser(
    @Query('sort') sort?: 'lastPracticeAt' | 'createdAt',
    @Query('dir') dir?: 'asc' | 'desc',
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<PracticeExerciseResponseDto[]> {
    const exercises = await this.exerciseService.findExercisesForUser(
      undefined, // current user is inferred from context
      {
        sort,
        dir,
        limit,
        offset,
        topics,
      },
    );
    return exercises.map((exercise) =>
      PracticeExerciseResponseDto.fromEntity(exercise),
    );
  }
}
