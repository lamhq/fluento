import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { PracticeType } from '../../../core/types/practice-type';
import SentenceVariation from './SentenceVariation';

const meta = {
  title: 'Practice/Articulation/SentenceVariation',
  component: SentenceVariation,
} satisfies Meta<typeof SentenceVariation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000c',
      format: ExerciseFormat.Sentence,
      name: 'Describe work experiences',
      skill: ExerciseSkill.ARTICULATION,
      topics: ['Job Interview', 'Software Engineering'],
      references: [],
      scenario: 'Describe your software development experience in an interview.',
      type: PracticeType.SENTENCE_VARIATION,
      practiceCount: 0,
      words: [
        'over / more than',
        '10 years',
        'software',
        'tech lead',
        'manage',
        'coding',
      ],
      sentence:
        "I have over 10 years of experience in software development. For the past 6 years, I've worked as a tech lead, managing development teams, and doing hands-on coding.",
    },
  },
};
