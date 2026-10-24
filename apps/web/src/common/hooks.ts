import { useEffect, useState } from 'react';

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = window.localStorage.getItem(key);
    if (stored === null) {
      return initialValue;
    }

    try {
      return JSON.parse(stored) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

export function useDialogState<T extends string | boolean>(
  initialState: T | null = null,
) {
  const [open, setOpenState] = useState<T | null>(initialState);

  const setOpen = (state: T | null) => {
    setOpenState((previous) => (previous === state ? null : state));
  };

  return [open, setOpen] as const;
}
