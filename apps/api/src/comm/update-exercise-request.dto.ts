import {
  ExercisePromptDto,
  ExerciseSentenceDto,
} from './create-exercise-request.dto';

export class UpdateExerciseRequestDto {
  name?: string;
  sentences?: ExerciseSentenceDto[];
  prompts?: ExercisePromptDto[];
  topics?: string[];
}
