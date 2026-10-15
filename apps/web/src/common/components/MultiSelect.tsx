import { type Ref, useId, useState } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';

type Option = string | { label: string; value?: string };

const loadingOption: Option = {
  label: 'Fetching items...',
};

interface MultiSelectProps {
  options?: Option[];
  value: string[];
  onChange: (values: string[]) => void;
  onBlur?: () => void;
  invalid?: boolean;
  ref?: Ref<HTMLInputElement>;
  creatable?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export default function MultiSelect({
  options = [],
  creatable,
  value,
  onChange,
  onBlur,
  invalid,
  ref,
  placeholder = 'Select options',
  isLoading,
}: MultiSelectProps) {
  const id = useId();
  const anchor = useComboboxAnchor();
  const [inputValue, setInputValue] = useState('');

  // all available options, including selected values
  const viewOptions = [
    ...value,
    ...options.filter(
      (option) => typeof option === 'string' && !value.includes(option),
    ),
  ];

  // add a Create option if no item match the query
  const query = inputValue.trim();
  const normalizedQuery = query.toLocaleLowerCase();
  const isExisting = viewOptions.some(
    (option) =>
      typeof option === 'string' &&
      option.trim().toLocaleLowerCase() === normalizedQuery,
  );
  if (creatable && query && !isExisting) {
    viewOptions.push({
      label: `Add "${query}"`,
      value: query,
    });
  }
  if (isLoading) {
    viewOptions.push(loadingOption);
  }

  const handleChange = (values: Option[]) => {
    const normalizedValues = values.flatMap(
      (item) =>
        typeof item === 'string'
          ? [item] // real options
          : item.value === undefined
            ? [] // ignore the Loading option
            : [item.value], // convert the Create option to string,
    );
    onChange(normalizedValues);
  };

  return (
    <Combobox
      multiple
      autoHighlight
      items={viewOptions}
      value={value}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      onOpenChange={(open, eventDetails) => {
        if (!open && eventDetails.reason === 'item-press') {
          setInputValue('');
          eventDetails.cancel();
        }
      }}
      onValueChange={handleChange}
    >
      <ComboboxChips ref={anchor} aria-invalid={invalid}>
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((item) => (
                <ComboboxChip key={item}>{item}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                id={id}
                ref={ref}
                aria-invalid={invalid}
                onBlur={onBlur}
                placeholder={placeholder}
              />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => {
            return typeof item === 'string' ? (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            ) : (
              <ComboboxItem
                key={item.value ?? item.label}
                value={item.value ?? item.label}
                disabled={item.value === undefined}
              >
                {item.label}
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
