import { Body, Controller, Param, Post } from '@nestjs/common';

import type { UserEntity } from '../../../user/core/user.entity';
import { User } from '../../../user/interface/user.decorator';
import { ExerciseService } from '../../core/exercise.service';
import { SubmitResponseRequestDto } from './submit-response-request.dto';

@Controller('comm/exercises')
export class SubmitResponseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post(':exerciseId/responses')
  async submitResponse(
    @User() user: UserEntity,
    @Param('exerciseId') exerciseId: string,
    @Body() body: SubmitResponseRequestDto,
  ) {
    return this.exerciseService.submitResponse(
      exerciseId,
      user.id,
      body.response,
    );
  }
}
