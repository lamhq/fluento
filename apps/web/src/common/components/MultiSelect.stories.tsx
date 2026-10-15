import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ComponentProps, useState } from 'react';

import MultiSelect from './MultiSelect';

const meta = {
  title: 'Common/MultiSelect',
  component: MultiSelect,
} satisfies Meta<typeof MultiSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
  'Travel',
  'Work',
  'Food',
  'Education',
  'Health',
  'Finance',
  'Entertainment',
  'Sports',
];

function UncontrolledMultiSelect(props: ComponentProps<typeof MultiSelect>) {
  const [value, setValue] = useState(props.value);

  return <MultiSelect {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: {
    options,
    value: ['Travel'],
    onChange: () => undefined,
  },
  render: (args) => <UncontrolledMultiSelect {...args} />,
};

export const Creatable: Story = {
  args: {
    options: [],
    creatable: true,
    value: [],
    onChange: () => undefined,
  },
  render: (args) => <UncontrolledMultiSelect {...args} />,
};

export const Loading: Story = {
  args: {
    options: [],
    isLoading: true,
    value: [],
    onChange: () => undefined,
  },
  render: (args) => <UncontrolledMultiSelect {...args} />,
};
