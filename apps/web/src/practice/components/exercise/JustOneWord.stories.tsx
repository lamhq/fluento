import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { PracticeType } from '../../../core/types/practice-type';
import JustOneWord from './JustOneWord';

const meta = {
  title: 'Practice/Vocabulary/JustOneWord',
  component: JustOneWord,
} satisfies Meta<typeof JustOneWord>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f000000000000000000007',
      format: ExerciseFormat.Word,
      name: 'baggage claim',
      skill: ExerciseSkill.VOCABULARY,
      topics: ['Airport', 'Travel'],
      references: [],
      type: PracticeType.JUST_ONE_WORD,
      practiceCount: 0,
      word: 'baggage claim',
      meaning:
        'The area in an airport where passengers collect their checked luggage after a flight (nhận hành lý).',
      sentences: ['After landing, head to baggage claim to pick up your suitcase.'],
      clues: ['luggage', 'carousel', 'claim ticket', 'lost and found', 'pickup'],
    },
  },
};
