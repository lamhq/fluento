import { Badge } from '@/components/ui/badge';

import type { ExerciseStatus } from '../../../../api/types';

export default function ExerciseStatusBadge({ status }: { status: ExerciseStatus }) {
  return (
    <Badge
      variant={status === 'active' ? 'default' : 'secondary'}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}
