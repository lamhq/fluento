import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ExerciseEntity, ExerciseStatus } from '../core/exercise.entity';
import { ExerciseExpectedResponseDto } from './create-exercise-request.dto';

export class UpdateExerciseRequestDto {
  @IsString()
  @IsNotEmpty()
  scenario: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  prompts: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseExpectedResponseDto)
  expectedResponses: ExerciseExpectedResponseDto[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  learnerRole?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  counterpartRole?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topics: string[];

  @IsNotEmpty()
  @IsEnum(ExerciseStatus)
  status: ExerciseStatus;

  toEntity(): Omit<
    ExerciseEntity,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  > {
    return {
      scenario: this.scenario,
      prompts: this.prompts,
      expectedResponses: this.expectedResponses,
      learnerRole: this.learnerRole,
      counterpartRole: this.counterpartRole,
      topics: this.topics,
      status: this.status,
    };
  }
}
