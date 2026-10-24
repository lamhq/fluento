import { type Ref } from 'react';

import MultiSelect from '../../../common/components/MultiSelect';
import { useGetTopics } from '../hooks';

interface TopicsSelectProps {
  value?: string[];
  onChange?: (values: string[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
  creatable?: boolean;
}

export default function TopicsSelect({
  value,
  onChange,
  onBlur,
  invalid,
  ref,
  creatable,
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
      creatable={creatable}
      placeholder={creatable ? 'Select or add topics' : 'Select topics'}
    />
  );
}
