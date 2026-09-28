import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../../common/constants';
import { RequireUser } from '../../../common/interface/require-user.guard';
import { ExerciseService } from '../../../content/core/exercise.service';
import { ExerciseDto } from './exercise.dto';
import { UpdateExerciseDto } from './update-exercise.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class UpdateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExerciseDto,
  ): Promise<ExerciseDto> {
    return ExerciseDto.fromEntity(await this.exerciseService.update(id, body));
  }
}
