import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ExerciseEntity, ExerciseStatus } from '../../core/exercise.entity';

export class ExerciseExpectedResponseDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  style: string[];
}

export class CreateExerciseRequestDto {
  @IsNotEmpty()
  @IsEnum(ExerciseStatus)
  status: ExerciseStatus;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topics: string[];

  @IsString()
  @IsNotEmpty()
  scenario: string;

  @IsString()
  @IsNotEmpty()
  learnerRole: string;

  @IsString()
  @IsNotEmpty()
  counterpartRole: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  prompts: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseExpectedResponseDto)
  expectedResponses: ExerciseExpectedResponseDto[];

  toEntity(): Omit<
    ExerciseEntity,
    'id' | 'userId' | 'createdAt' | 'updatedAt'
  > {
    return {
      status: this.status,
      topics: this.topics,
      scenario: this.scenario,
      learnerRole: this.learnerRole,
      counterpartRole: this.counterpartRole,
      prompts: this.prompts,
      expectedResponses: this.expectedResponses,
    };
  }
}
