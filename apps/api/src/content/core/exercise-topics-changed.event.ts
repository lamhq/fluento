export const EXERCISE_TOPICS_CHANGED_EVENT = 'exercise.topics.changed';

export class ExerciseTopicsChangedEvent {
  constructor(
    readonly userId: string,
    readonly topics: string[],
  ) {}
}
