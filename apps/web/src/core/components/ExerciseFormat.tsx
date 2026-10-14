import { Badge } from '@/components/ui/badge';

import type { ExerciseFormat as ExerciseFormatType } from '../types/exercise-format';

export default function ExerciseFormat({ format }: { format: ExerciseFormatType }) {
  return <Badge className="capitalize">{format}</Badge>;
}
