import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { PracticeService } from '../core/practice.service';
import { SubmitResponseRequestDto } from './submit-response.request.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class SubmitResponseHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post(':exerciseId/responses')
  @HttpCode(HttpStatus.CREATED)
  async submitResponse(
    @Param('exerciseId') exerciseId: string,
    @Body() body: SubmitResponseRequestDto,
  ) {
    return this.practiceService.submitResponse(exerciseId, body.response);
  }
}
