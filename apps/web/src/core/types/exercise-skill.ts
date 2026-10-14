import { z } from 'zod';

export enum ExerciseSkill {
  COMMUNICATION = 'communication',
  VOCABULARY = 'vocabulary',
  ARTICULATION = 'articulation',
}

export const exerciseSkillSchema = z.enum(ExerciseSkill);

export const exerciseSkills: { label: string; value: ExerciseSkill }[] = [
  { label: 'Communication', value: ExerciseSkill.COMMUNICATION },
  { label: 'Vocabulary', value: ExerciseSkill.VOCABULARY },
  { label: 'Articulation', value: ExerciseSkill.ARTICULATION },
];
