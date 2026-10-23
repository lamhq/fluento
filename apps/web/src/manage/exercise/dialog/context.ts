import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { ExerciseSummary } from '../../../core/types/exercise-summary';

export type ExerciseDialogType = 'create' | 'update' | 'import' | 'delete';

export interface ExerciseContextValue {
  open: ExerciseDialogType | null;
  setOpen: (state: ExerciseDialogType | null) => void;
  currentRow: ExerciseSummary | null;
  setCurrentRow: Dispatch<SetStateAction<ExerciseSummary | null>>;
}

export const ExerciseContext = createContext<ExerciseContextValue | null>(null);
