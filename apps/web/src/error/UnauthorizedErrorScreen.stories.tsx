import type { Meta, StoryObj } from '@storybook/react-vite';

import UnauthorizedErrorScreen from './UnauthorizedErrorScreen';

const meta = {
  title: 'Errors/Unauthorized',
  component: UnauthorizedErrorScreen,
} satisfies Meta<typeof UnauthorizedErrorScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
