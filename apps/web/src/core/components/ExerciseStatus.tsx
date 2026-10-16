import { Badge } from '@/components/ui/badge';

import { ExerciseStatus as ExerciseStatusValue } from '../types/exercise-status';

export default function ExerciseStatus({ status }: { status: ExerciseStatusValue }) {
  return (
    <Badge
      variant={status === ExerciseStatusValue.ACTIVE ? 'default' : 'secondary'}
      className="capitalize"
    >
      {status}
    </Badge>
  );
}
