import type { Meta, StoryObj } from '@storybook/react-vite';

import NotFoundErrorScreen from './NotFoundErrorScreen';

const meta = {
  title: 'Errors/Not Found',
  component: NotFoundErrorScreen,
} satisfies Meta<typeof NotFoundErrorScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
