import { Textarea } from '@/components/ui/textarea';

export type LinesInputProps = Omit<
  React.ComponentProps<typeof Textarea>,
  'value' | 'onChange'
> & {
  value?: string[];
  onChange?: (values: string[]) => void;
};

export default function LinesInput({ value, onChange, ...props }: LinesInputProps) {
  return (
    <Textarea
      {...props}
      value={value ? value.join('\n') : undefined}
      onChange={(event) => {
        onChange?.(event.currentTarget.value.split(/\r?\n/));
      }}
    />
  );
}
