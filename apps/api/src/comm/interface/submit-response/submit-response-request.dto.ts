import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitResponseRequestDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.trim())
  response: string;
}
