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
import { SubmitResponseDto } from './submit-response.dto';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class SubmitResponseHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post(':exerciseId/responses')
  @HttpCode(HttpStatus.CREATED)
  async submitResponse(
    @Param('exerciseId') exerciseId: string,
    @Body() body: SubmitResponseDto,
  ) {
    return this.practiceService.submitResponse(exerciseId, body.response);
  }
}
