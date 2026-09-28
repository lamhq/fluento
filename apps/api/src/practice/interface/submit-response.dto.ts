import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitResponseDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  response: string;
}
