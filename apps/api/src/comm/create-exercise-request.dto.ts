export class ExerciseExpectedResponseDto {
  content: string;
  style: string[];
}

export class CreateExerciseRequestDto {
  topics: string[];
  scenario: string;
  learnerRole: string;
  counterpartRole: string;
  prompts: string[];
  expectedResponses: ExerciseExpectedResponseDto[];
}
