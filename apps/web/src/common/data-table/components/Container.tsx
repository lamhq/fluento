import { cn } from '@/lib/utils';

export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        // Add margin on mobile when bulk action toolbar appears
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4',
      )}
    >
      {children}
    </div>
  );
}
