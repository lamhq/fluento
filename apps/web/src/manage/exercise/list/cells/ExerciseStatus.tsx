import { Badge } from '@/components/ui/badge';

import type { ExerciseStatus } from '../../../../api/types';

export default function ExerciseStatus({ status }: { status: ExerciseStatus }) {
  return (
    <Badge
      variant={status === 'active' ? 'default' : 'secondary'}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}
