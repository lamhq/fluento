import { type ReactNode, useState } from 'react';

import { useDialogState } from '../../common/hooks';
import type { ExerciseSummary } from '../../core/types/exercise-summary';
import { ExerciseContext, type ExerciseDialogType } from './create/context';

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useDialogState<ExerciseDialogType>(null);
  const [currentRow, setCurrentRow] = useState<ExerciseSummary | null>(null);

  return (
    <ExerciseContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExerciseContext>
  );
}
