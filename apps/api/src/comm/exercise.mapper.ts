import { Injectable } from '@nestjs/common';

import { CreateExerciseRequestDto } from './create-exercise-request.dto';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseResponseDto } from './exercise-response.dto';
import { UpdateExerciseRequestDto } from './update-exercise-request.dto';

@Injectable()
export class ExerciseMapper {
  toResponse(entity: ExerciseEntity): ExerciseResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      sentences: entity.sentences,
      prompts: entity.prompts,
      topics: entity.topics,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(data: CreateExerciseRequestDto): ExerciseEntity {
    return {
      id: '',
      name: data.name,
      sentences: data.sentences,
      prompts: data.prompts,
      topics: data.topics,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toPartialEntity(data: UpdateExerciseRequestDto): Partial<ExerciseEntity> {
    return {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.sentences !== undefined ? { sentences: data.sentences } : {}),
      ...(data.prompts !== undefined ? { prompts: data.prompts } : {}),
      ...(data.topics !== undefined ? { topics: data.topics } : {}),
    };
  }
}
