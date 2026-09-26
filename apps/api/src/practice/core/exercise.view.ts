import { ExerciseEntity } from '../../content/core/exercise.entity';
import { LearnerExerciseProgressEntity } from './learner-exercise-progress.entity';

/**
 * ExerciseView represents an exercise with the learner's practice progress for that exercise.
 * This is a composite entity combining data from the exercises and learner_exercise_progress collections.
 */
export class ExerciseView extends ExerciseEntity {
  // Practice progress fields
  practicedAt: Date;
  practiceCount: number;

  constructor(data?: Partial<ExerciseView>) {
    super(data);
    Object.assign(this, data);
  }

  /**
   * Factory method to create an ExerciseView from an ExerciseEntity and LearnerExerciseProgressEntity
   */
  static fromEntities(
    exercise: ExerciseEntity,
    progress: LearnerExerciseProgressEntity,
  ): ExerciseView {
    const view = new ExerciseView();
    Object.assign(view, exercise, {
      practicedAt: progress.practicedAt,
      practiceCount: progress.practiceCount,
    });
    return view;
  }
}
