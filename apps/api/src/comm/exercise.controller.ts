import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CreateExerciseRequestDto } from './create-exercise-request.dto';
import { ExerciseMapper } from './exercise.mapper';
import { ExerciseService } from './exercise.service';
import { ExerciseResponseDto } from './exercise-response.dto';
import { UpdateExerciseRequestDto } from './update-exercise-request.dto';

@Controller('exercises')
export class ExerciseController {
  constructor(
    private readonly exerciseService: ExerciseService,
    private readonly exerciseMapper: ExerciseMapper,
  ) {}

  @Post()
  async create(
    @Body() body: CreateExerciseRequestDto,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseMapper.toResponse(
      await this.exerciseService.create(body),
    );
  }

  @Get()
  async findAll(): Promise<ExerciseResponseDto[]> {
    const exercises = await this.exerciseService.findAll();
    return exercises.map((exercise) =>
      this.exerciseMapper.toResponse(exercise),
    );
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ExerciseResponseDto> {
    const exercise = await this.exerciseService.findById(id);

    if (!exercise) {
      throw new NotFoundException(`Exercise with id ${id} not found`);
    }

    return this.exerciseMapper.toResponse(exercise);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateExerciseRequestDto,
  ): Promise<ExerciseResponseDto> {
    return this.exerciseMapper.toResponse(
      await this.exerciseService.update(id, body),
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ExerciseResponseDto> {
    return this.exerciseMapper.toResponse(
      await this.exerciseService.delete(id),
    );
  }
}
