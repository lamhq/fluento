import { ExerciseEntity } from '../../content/core/exercise.entity';
import { LearnerExerciseProgressEntity } from './learner-exercise-progress.entity';

/**
 * PracticeExerciseView represents an exercise with the learner's practice progress for that exercise.
 * This is a composite entity combining data from the exercises and learner_exercise_progress collections.
 */
export class PracticeExerciseView extends ExerciseEntity {
  // Practice progress fields
  practicedAt: Date;
  practiceCount: number;

  constructor(data?: Partial<PracticeExerciseView>) {
    super(data);
    Object.assign(this, data);
  }

  /**
   * Factory method to create a PracticeExerciseView from an ExerciseEntity and LearnerExerciseProgressEntity
   */
  static fromEntities(
    exercise: ExerciseEntity,
    progress: LearnerExerciseProgressEntity,
  ): PracticeExerciseView {
    const view = new PracticeExerciseView();
    Object.assign(view, exercise, {
      practicedAt: progress.practicedAt,
      practiceCount: progress.practiceCount,
    });
    return view;
  }
}
