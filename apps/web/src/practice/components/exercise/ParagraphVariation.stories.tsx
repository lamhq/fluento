import type { Meta, StoryObj } from '@storybook/react-vite';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import { PracticeType } from '../../../core/types/practice-type';
import ParagraphVariation from './ParagraphVariation';

const meta = {
  title: 'Practice/Articulation/ParagraphVariation',
  component: ParagraphVariation,
} satisfies Meta<typeof ParagraphVariation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise: {
      id: '65f00000000000000000000e',
      format: ExerciseFormat.Paragraph,
      name: 'Mid-Autumn Festival Introduction',
      skill: ExerciseSkill.ARTICULATION,
      topics: ['Mid-Autumn Festival'],
      references: [],
      scenario: 'Introduce the Mid-Autumn Festival to an international audience.',
      type: PracticeType.PARAGRAPH_VARIATION,
      practiceCount: 0,
      paragraph:
        'The Mid-Autumn Festival is a major Vietnamese celebration held on the 15th day of the eighth lunar month. Families gather to enjoy mooncakes and admire the full moon. Children take part in lantern parades and lion dances. The festival promotes family unity and preserves cultural traditions.',
      words: [
        'Mid-Autumn Festival',
        '15th day',
        'mooncakes',
        'lanterns',
        'lion dances',
        'full moon',
        'family',
      ],
    },
  },
};
