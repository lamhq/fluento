import type { ComponentPropsWithoutRef } from 'react';

import { Button as BaseButton } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export type ButtonProps = ComponentPropsWithoutRef<typeof BaseButton> & {
  isLoading?: boolean;
};

export default function Button({
  children,
  isLoading = false,
  disabled,
  'aria-busy': ariaBusy,
  ...props
}: ButtonProps) {
  const isDisabled = disabled ?? isLoading;

  return (
    <BaseButton
      data-loading={isLoading ? 'true' : undefined}
      aria-busy={ariaBusy ?? isLoading}
      disabled={isDisabled}
      {...props}
    >
      {children}
      {isLoading && <Spinner data-icon="inline-start" />}
    </BaseButton>
  );
}
