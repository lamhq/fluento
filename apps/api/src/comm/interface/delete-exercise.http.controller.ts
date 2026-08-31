import { Controller, Delete, Param, UseGuards } from '@nestjs/common';

import { ApiVersion } from '../../common/constants';
import { RequireUser } from '../../common/interface/require-user.guard';
import { ExerciseService } from '../core/exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class DeleteExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ExerciseResponseDto> {
    return ExerciseResponseDto.fromEntity(
      await this.exerciseService.delete(id),
    );
  }
}
