import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

import { stringToArray } from '../../../common/utils';
import {
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../content/core/exercise.entity';

export class FindExercisesDto {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @IsOptional()
  @Transform(stringToArray)
  @IsArray()
  @IsString({ each: true, message: 'topics must contain only string values' })
  topics?: string[];

  @IsOptional()
  @Transform(stringToArray)
  @IsArray()
  @IsString({ each: true, message: 'skills must contain only string values' })
  @IsEnum(ExerciseSkill, {
    each: true,
    message: `skills must be one of: ${Object.values(ExerciseSkill).join(', ')}`,
  })
  skills?: ExerciseSkill[];

  @IsOptional()
  @Transform(stringToArray)
  @IsArray()
  @IsString({ each: true, message: 'formats must contain only string values' })
  @IsEnum(ExerciseFormat, {
    each: true,
    message: `formats must be one of: ${Object.values(ExerciseFormat).join(', ')}`,
  })
  formats?: ExerciseFormat[];

  @IsOptional()
  @Transform(stringToArray)
  @IsArray()
  @IsString({ each: true, message: 'status must contain only string values' })
  @IsEnum(ExerciseStatus, {
    each: true,
    message: `status must be one of: ${Object.values(ExerciseStatus).join(', ')}`,
  })
  status?: ExerciseStatus[];

  @IsOptional()
  @IsString({ message: 'sort must be a string' })
  @Matches(/^(?:-?name(?:,-?status)?|-?status(?:,-?name)?)$/, {
    message:
      'sort must contain unique name and status fields, optionally prefixed with -',
  })
  sort?: string;

  @Type(() => Number)
  @IsInt({ message: 'offset must be a non-negative integer' })
  @Min(0, { message: 'offset must be a non-negative integer' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'offset must be a non-negative integer',
  })
  offset = 0;

  @Type(() => Number)
  @IsInt({ message: 'limit must be a positive integer' })
  @Min(1, { message: 'limit must be a positive integer' })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'limit must be a positive integer',
  })
  limit = 10;
}
