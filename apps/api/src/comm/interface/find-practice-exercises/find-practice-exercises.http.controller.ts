import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import type { UserEntity } from '../../../user/core/user.entity';
import { User } from '../../../user/interface/user.decorator';
import { ExerciseService } from '../../core/exercise.service';
import { PracticeExerciseQuery } from '../../core/practice-exercise-repository.port';
import { PracticeExerciseResponseDto } from '../practice-exercise-response.dto';

@Controller('learners')
export class FindPracticeExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('practice-exercises')
  async findPracticeExercises(
    @User() user: UserEntity,
    @Query('sort') sort?: 'lastPracticeAt' | 'createdAt',
    @Query('dir') dir?: 'asc' | 'desc',
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<PracticeExerciseResponseDto[]> {
    const params: PracticeExerciseQuery = {
      learnerId: user.id,
      sort,
      dir,
      limit,
      offset,
      topics,
    };

    const exercises = await this.exerciseService.findPracticeExercises(params);
    return exercises.map((exercise) =>
      PracticeExerciseResponseDto.fromEntity(exercise),
    );
  }
}
