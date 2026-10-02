import type { Meta, StoryObj } from '@storybook/react-vite';

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
      format: 'paragraph',
      name: 'Mid-Autumn Festival Introduction',
      skill: 'articulation',
      topics: ['Mid-Autumn Festival'],
      references: [],
      type: 'paragraph-variation',
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
