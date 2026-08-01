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
      topics: entity.topics,
      scenario: entity.scenario,
      learnerRole: entity.learnerRole,
      counterpartRole: entity.counterpartRole,
      prompts: entity.prompts,
      expectedResponses: entity.expectedResponses,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toEntity(data: CreateExerciseRequestDto): ExerciseEntity {
    return {
      id: '',
      topics: data.topics,
      scenario: data.scenario,
      learnerRole: data.learnerRole,
      counterpartRole: data.counterpartRole,
      prompts: data.prompts,
      expectedResponses: data.expectedResponses,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  toPartialEntity(data: UpdateExerciseRequestDto): Partial<ExerciseEntity> {
    return {
      ...(data.topics !== undefined ? { topics: data.topics } : {}),
      ...(data.scenario !== undefined ? { scenario: data.scenario } : {}),
      ...(data.learnerRole !== undefined
        ? { learnerRole: data.learnerRole }
        : {}),
      ...(data.counterpartRole !== undefined
        ? { counterpartRole: data.counterpartRole }
        : {}),
      ...(data.prompts !== undefined ? { prompts: data.prompts } : {}),
      ...(data.expectedResponses !== undefined
        ? { expectedResponses: data.expectedResponses }
        : {}),
    };
  }
}
