import type { Meta, StoryObj } from '@storybook/react-vite';

import GeneralErrorScreen from './GeneralErrorScreen';

const meta = {
  title: 'Errors/General',
  component: GeneralErrorScreen,
} satisfies Meta<typeof GeneralErrorScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onRetry: () => undefined,
  },
};
