import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import LinesInput from './LinesInput';

const meta = {
  title: 'Common/LinesInput',
  component: LinesInput,
} satisfies Meta<typeof LinesInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: ['First line', 'Second line'],
    onChange: () => undefined,
  },
  render: () => {
    const [value, setValue] = useState(['First line', 'Second line']);
    return <LinesInput value={value} onChange={setValue} />;
  },
};
