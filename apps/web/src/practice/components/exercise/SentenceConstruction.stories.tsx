import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { PracticeType } from '../../../core/types/practice-type';
import SentenceConstruction from './SentenceConstruction';

const meta = {
  title: 'Practice/Articulation/SentenceConstruction',
  component: SentenceConstruction,
} satisfies Meta<typeof SentenceConstruction>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000b',
      format: ExerciseFormat.Sentence,
      name: 'Describe your background',
      skill: ExerciseSkill.ARTICULATION,
      topics: ['Job Interview', 'Software Engineering'],
      references: [],
      scenario: 'Describe your educational background in a job interview.',
      type: PracticeType.SENTENCE_CONSTRUCTION,
      practiceCount: 0,
      words: ['study', 'computer science', 'university', "bachelor's degree"],
      sentence:
        "I studied computer science at university and had a bachelor's degree.",
    },
  },
};
