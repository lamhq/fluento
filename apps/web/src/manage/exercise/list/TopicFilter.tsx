import { ColumnFilter } from '../../../common/data-table';
import { useGetTopics } from '../hooks';

interface TopicFilterProps {
  values: string[];
  onChange: (values: string[]) => void;
}

export default function TopicFilter({ values, onChange }: TopicFilterProps) {
  const { data, error } = useGetTopics();
  if (error) {
    throw error;
  }

  return (
    <ColumnFilter
      title="Topics"
      values={values}
      onChange={onChange}
      options={(data ?? []).map(({ name }) => ({
        label: name,
        value: name,
      }))}
    />
  );
}
