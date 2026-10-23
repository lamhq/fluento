import type { Meta, StoryObj } from '@storybook/react-vite';

import ForbiddenErrorScreen from './ForbiddenErrorScreen';

const meta = {
  title: 'Errors/Forbidden',
  component: ForbiddenErrorScreen,
} satisfies Meta<typeof ForbiddenErrorScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
