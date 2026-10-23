import { useContext } from 'react';

import { ExerciseContext } from './context';

export function useExerciseDialogs() {
  const context = useContext(ExerciseContext);

  if (!context) {
    throw new Error('useExerciseDialogs must be used within ExerciseProvider.');
  }

  return context;
}
