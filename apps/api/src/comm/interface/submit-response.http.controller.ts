import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { SubmitResponseRequestDto } from './submit-response-request.dto';

@Controller({ path: 'comm/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class SubmitResponseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post(':exerciseId/responses')
  async submitResponse(
    @Param('exerciseId') exerciseId: string,
    @Body() body: SubmitResponseRequestDto,
  ) {
    return this.exerciseService.submitResponse(exerciseId, body.response);
  }
}
