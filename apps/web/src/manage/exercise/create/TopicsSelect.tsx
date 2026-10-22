import { type Ref } from 'react';

import MultiSelect from '../../../common/components/MultiSelect';
import { useGetTopics } from '../hooks';

interface TopicsSelectProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export default function TopicsSelect({
  value,
  onChange,
  onBlur,
  invalid,
  ref,
}: TopicsSelectProps) {
  const { data, isLoading } = useGetTopics();
  return (
    <MultiSelect
      options={data?.map(({ name }) => name)}
      isLoading={isLoading}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      invalid={invalid}
      ref={ref}
      creatable
      placeholder="Select or add topics"
    />
  );
}
