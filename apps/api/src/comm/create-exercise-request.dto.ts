export class ExerciseSentenceDto {
  content: string;
  style: string;
  meaning?: string;
}

export class ExercisePromptDto {
  content: string;
  style: string;
  meaning?: string;
}

export class CreateExerciseRequestDto {
  name: string;
  sentences: ExerciseSentenceDto[];
  prompts: ExercisePromptDto[];
  topics: string[];
}
