import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ExerciseEntity, ExerciseStatus } from '../../core/exercise.entity';
import { ExerciseExpectedResponseDto } from '../create-exercise/create-exercise-request.dto';

export class UpdateExerciseRequestDto {
  @IsNotEmpty()
  @IsEnum(ExerciseStatus)
  status: ExerciseStatus;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topics?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  scenario?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  learnerRole?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  counterpartRole?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  prompts?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseExpectedResponseDto)
  expectedResponses?: ExerciseExpectedResponseDto[];

  toEntity(): Partial<ExerciseEntity> {
    return new ExerciseEntity({
      status: this.status,
      topics: this.topics,
      scenario: this.scenario,
      learnerRole: this.learnerRole,
      counterpartRole: this.counterpartRole,
      prompts: this.prompts,
      expectedResponses: this.expectedResponses,
    });
  }
}
