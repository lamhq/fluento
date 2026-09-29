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
      topics: ['Mid-Autumn Festival'],
      type: 'paragraph-variation',
      practicedAt: null,
      practiceCount: 0,
      scenario: 'Mid-Autumn Festival Introduction',
      prompts: [
        'Read and practice the following paragraph about the Mid-Autumn Festival.',
      ],
      paragraph:
        'The Mid-Autumn Festival is one of Vietnam’s most important traditional celebrations, held on the 15th day of the eighth lunar month when the moon is fullest. Families gather to enjoy mooncakes, fruits, and tea while admiring the moon. Children carry colorful lanterns, join parades, and watch lion dances. Folk tales like Cuội and the Moon Lady are shared, while schools and communities host performances and games. The festival symbolizes unity, happiness, and family reunion.',
      words: [
        'Mid-Autumn Festival',
        '15th day',
        'mooncakes',
        'lanterns',
        'lion dances',
        'full moon',
        'family reunion',
      ],
    },
  },
};
