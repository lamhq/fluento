import { ExerciseExpectedResponseDto } from './create-exercise-request.dto';

export class UpdateExerciseRequestDto {
  topics?: string[];
  scenario?: string;
  learnerRole?: string;
  counterpartRole?: string;
  prompts?: string[];
  expectedResponses?: ExerciseExpectedResponseDto[];
}
