import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface ContainerProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        {children}
      </div>
    </div>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return <span className="font-medium">{children}</span>;
}

export function Description({ children }: { children: ReactNode }) {
  return <p className="text-center text-muted-foreground">{children}</p>;
}

export function Actions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex gap-4">{children}</div>;
}
