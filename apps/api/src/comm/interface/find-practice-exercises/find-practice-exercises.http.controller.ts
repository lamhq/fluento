import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ExerciseService } from '../../core/exercise.service';
import { LearnerExerciseQuery } from '../../core/learner-exercise-repository.port';
import { PracticeExerciseResponseDto } from '../practice-exercise-response.dto';

@Controller('learners')
export class FindPracticeExercisesHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Get('practice-exercises')
  async findPracticeExercises(
    @Query('sort') sort?: 'lastPracticeAt' | 'createdAt',
    @Query('dir') dir?: 'asc' | 'desc',
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
    @Query('topics', new ParseArrayPipe({ optional: true })) topics?: string[],
  ): Promise<PracticeExerciseResponseDto[]> {
    const params: LearnerExerciseQuery = {
      learnerId: 'lear_1', // Replace with actual learner ID from authentication context
      sort,
      dir,
      limit,
      offset,
      topics: topics,
    };

    const exercises = await this.exerciseService.findPracticeExercises(params);
    return exercises.map((exercise) =>
      PracticeExerciseResponseDto.fromEntity(exercise),
    );
  }
}
