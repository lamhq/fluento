import { Badge } from '@/components/ui/badge';

import type { ExerciseSkill } from '../../../../api/types';

export default function ExerciseSkillBadge({ skill }: { skill: ExerciseSkill }) {
  return (
    <Badge variant="outline" className="capitalize">
      {skill}
    </Badge>
  );
}
