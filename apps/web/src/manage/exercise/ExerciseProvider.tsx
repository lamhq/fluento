import { type ReactNode, useState } from 'react';

import { useDialogState } from '../../common/hooks';
import type { Exercise } from '../../core/types/exercise';
import { ExerciseContext, type ExerciseDialogType } from './create/context';

export function ExerciseProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useDialogState<ExerciseDialogType>(null);
  const [currentRow, setCurrentRow] = useState<Exercise | null>(null);

  return (
    <ExerciseContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </ExerciseContext>
  );
}
