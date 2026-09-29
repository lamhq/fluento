import type { Meta, StoryObj } from '@storybook/react-vite';

import ParagraphVariationExercise from './ParagraphVariationExercise';

const meta = {
  component: ParagraphVariationExercise,
} satisfies Meta<typeof ParagraphVariationExercise>;

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
        'The Mid-Autumn Festival is one of the most important traditional celebrations in Vietnam. It is usually held on the 15th day of the eighth lunar month when the moon is at its fullest and brightest. This festival is especially meaningful for children, who eagerly wait for the occasion each year. Families often gather together to enjoy mooncakes, fruits, and tea while admiring the beautiful moon. Children carry colorful lanterns and participate in joyful lantern parades around their neighborhoods. Lion dances are also a popular activity that brings excitement and good luck during the festival. Many people believe that the full moon symbolizes unity, happiness, and family reunion. Traditional folk stories, such as the tale of Cuội and the Moon Lady, are often shared with children. Schools and communities frequently organize cultural performances and games to celebrate the event. Overall, the Mid-Autumn Festival is a cherished Vietnamese tradition that strengthens family bonds and preserves cultural values.',
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
