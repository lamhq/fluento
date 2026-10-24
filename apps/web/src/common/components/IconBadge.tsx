import type { ComponentType } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface IconBadgeProps {
  label: string;
  icon?: ComponentType<{ size?: number; className?: string }>;
  className?: string;
}

export default function IconBadge({ label, icon: Icon, className }: IconBadgeProps) {
  return (
    <Badge variant="outline" className={cn('p-1 capitalize', className)}>
      {Icon && <Icon size={12} className="text-muted-foreground" />}
      <span>{label}</span>
    </Badge>
  );
}
