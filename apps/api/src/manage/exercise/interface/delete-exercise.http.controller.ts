import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';

import { RequireUser } from '../../../common/auth/require-user.guard';
import { ApiVersion } from '../../../common/http/api-version';
import { ExerciseService } from '../../../content/core/exercise.service';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class DeleteExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.exerciseService.delete(id);
  }
}
