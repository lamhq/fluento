import { ExerciseEntity } from './exercise.entity';

export class PracticeExerciseEntity extends ExerciseEntity {
  lastPracticeAt?: Date | null;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
