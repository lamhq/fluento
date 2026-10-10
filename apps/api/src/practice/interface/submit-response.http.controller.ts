import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../common/auth/require-user.guard.js';
import { ApiVersion } from '../../common/http/api-version.js';
import { PracticeService } from '../core/practice.service.js';
import { PracticeAttemptDto } from './practice-attempt.dto.js';
import type { SubmitResponseDto } from './submit-response.dto.js';
import { submitResponseSchema } from './submit-response.dto.js';

@Controller({ path: 'practice/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class SubmitResponseHttpController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post(':exerciseId/responses')
  @HttpCode(HttpStatus.CREATED)
  async submitResponse(
    @Param('exerciseId') exerciseId: string,
    @Body({ schema: submitResponseSchema })
    body: SubmitResponseDto,
  ): Promise<PracticeAttemptDto> {
    const submission = await this.practiceService.submitResponse(
      exerciseId,
      body.practiceType,
      body.response,
    );
    return PracticeAttemptDto.fromEntity(submission);
  }
}
