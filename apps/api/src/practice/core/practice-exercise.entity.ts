import { ExerciseEntity } from '../../content/core/exercise.entity';
import { LearnerExerciseEntity } from './learner-exercise.entity';

export class PracticeExerciseEntity extends ExerciseEntity {
  practicedAt: Date;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseEntity>) {
    super(data);
    Object.assign(this, data);
  }

  /**
   * Factory method to create an ExerciseView from an ExerciseEntity and LearnerExerciseProgressEntity
   */
  static fromEntities(
    exercise: ExerciseEntity,
    progress: LearnerExerciseEntity,
  ): PracticeExerciseEntity {
    const view = new PracticeExerciseEntity();
    Object.assign(view, exercise, {
      practicedAt: progress.practicedAt,
      practiceCount: progress.practiceCount,
    });
    return view;
  }
}
