import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { Exercise } from '../../../core/types/exercise';

export type ExerciseDialogType = 'create' | 'update' | 'import';

export interface ExerciseContextValue {
  open: ExerciseDialogType | null;
  setOpen: (state: ExerciseDialogType | null) => void;
  currentRow: Exercise | null;
  setCurrentRow: Dispatch<SetStateAction<Exercise | null>>;
}

export const ExerciseContext = createContext<ExerciseContextValue | null>(null);
