import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { PracticeType } from '../core/types';

export class SubmitResponseDto {
  @IsEnum(PracticeType)
  @IsNotEmpty()
  practiceType: PracticeType;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  response: string;
}
