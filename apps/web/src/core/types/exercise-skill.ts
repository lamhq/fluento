import { z } from 'zod';

export enum ExerciseSkill {
  Communication = 'communication',
  Vocabulary = 'vocabulary',
  Articulation = 'articulation',
}

export const exerciseSkillSchema = z.enum(ExerciseSkill);

export const exerciseSkills: { label: string; value: ExerciseSkill }[] = [
  { label: 'Communication', value: ExerciseSkill.Communication },
  { label: 'Vocabulary', value: ExerciseSkill.Vocabulary },
  { label: 'Articulation', value: ExerciseSkill.Articulation },
];
