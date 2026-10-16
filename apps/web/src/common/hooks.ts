import { useState } from 'react';

export function useDialogState<T extends string | boolean>(
  initialState: T | null = null,
) {
  const [open, setOpenState] = useState<T | null>(initialState);

  const setOpen = (state: T | null) => {
    setOpenState((previous) => (previous === state ? null : state));
  };

  return [open, setOpen] as const;
}
