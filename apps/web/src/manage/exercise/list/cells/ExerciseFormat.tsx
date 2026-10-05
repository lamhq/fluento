import { Badge } from '@/components/ui/badge';

import type { ExerciseFormat } from '../../../../api/types';

export default function ExerciseFormat({ format }: { format: ExerciseFormat }) {
  return <Badge className="capitalize">{format}</Badge>;
}
