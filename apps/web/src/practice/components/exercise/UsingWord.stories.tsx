import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { PracticeType } from '../../../core/types/practice-type';
import UsingWord from './UsingWord';

const meta = {
  title: 'Practice/Vocabulary/UsingWord',
  component: UsingWord,
} satisfies Meta<typeof UsingWord>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000006',
      format: ExerciseFormat.WORD,
      name: 'security',
      skill: ExerciseSkill.VOCABULARY,
      topics: ['Airport', 'Travel'],
      references: [],
      type: PracticeType.USING_WORD,
      practiceCount: 0,
      word: 'security',
      meaning:
        'The area where you have to get checked before entering the secure part of an airport (an ninh).',
      clues: [],
      sentences: [
        "At security, they'll check your bags and ask you to remove your shoes.",
      ],
    },
  },
};
