import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard';
import { ApiVersion } from '../../common/http/api-version';
import { PracticeService } from '../core/practice.service';
import { PracticeAttemptDto } from './practice-attempt.dto';
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
  ): Promise<PracticeAttemptDto> {
    const submission = await this.practiceService.submitResponse(
      exerciseId,
      body.practiceType,
      body.response,
    );
    return PracticeAttemptDto.fromEntity(submission);
  }
}
