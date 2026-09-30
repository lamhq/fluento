import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ApiVersion } from '../../../common/constants';
import { RequireUser } from '../../../common/interface/require-user.guard';
import { ExerciseService } from '../../../content/core/exercise.service';
import { CreateExerciseDto } from './create-exercise.dto';
import { ExerciseDto } from './exercise.dto';

@Controller({ path: 'manage/exercises', version: ApiVersion.V1 })
@UseGuards(RequireUser)
export class CreateExerciseHttpController {
  constructor(private readonly exerciseService: ExerciseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateExerciseDto): Promise<ExerciseDto> {
    return ExerciseDto.fromEntity(await this.exerciseService.create(body));
  }
}
