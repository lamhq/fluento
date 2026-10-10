import type { ComponentProps } from 'react';
import { useRef, useState } from 'react';

import { Input } from '@/components/ui/input';

type DebouncedInputProps = ComponentProps<typeof Input>;

export default function DebouncedInput({
  defaultValue,
  onChange,
  value,
  ...inputProps
}: DebouncedInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue ?? '');
  const timer = useRef<NodeJS.Timeout | null>(null);

  return (
    <Input
      {...inputProps}
      value={inputValue}
      onChange={(event) => {
        const nextValue = event.currentTarget.value;
        setInputValue(nextValue);

        if (timer.current !== null) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
          onChange?.(event);
        }, 300);
      }}
    />
  );
}
