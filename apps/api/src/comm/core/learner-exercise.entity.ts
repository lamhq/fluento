import { ExerciseEntity } from './exercise.entity';

export class LearnerExerciseEntity extends ExerciseEntity {
  lastPracticeAt?: Date | null;
  practiceCount: number;

  constructor(data?: Partial<LearnerExerciseEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
