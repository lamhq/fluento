import { Badge } from '@/components/ui/badge';

import type { ExerciseSkill as ExerciseSkillType } from '../types/exercise-skill';

export default function ExerciseSkill({ skill }: { skill: ExerciseSkillType }) {
  return (
    <Badge variant="outline" className="capitalize">
      {skill}
    </Badge>
  );
}
