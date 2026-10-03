import type { ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { cn } from '@/lib/utils';

export interface MultiSelectFormOption {
  label: string;
  value: string;
  description?: string;
}

interface MultiSelectFormProps {
  onSubmit: (selectedValues: string[]) => Promise<void>;
  options: MultiSelectFormOption[];
  defaultValues?: string[];
  submitLabel?: ReactNode;
}

interface MultiSelectFormData {
  selectedValues: string[];
}

export default function MultiSelectForm({
  onSubmit,
  options,
  defaultValues = [],
  submitLabel = 'Submit',
}: MultiSelectFormProps) {
  const form = useForm<MultiSelectFormData>({
    defaultValues: {
      selectedValues: defaultValues,
    },
  });
  const handleSubmit = (data: MultiSelectFormData) => {
    return onSubmit(data.selectedValues);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <Controller
        name="selectedValues"
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldGroup data-slot="checkbox-group">
            {options.map((option) => {
              const id = `multi-select-form-${option.value}`;
              const checked = field.value.includes(option.value);

              return (
                <Field
                  key={option.value}
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id={id}
                    name={field.name}
                    aria-invalid={fieldState.invalid}
                    checked={checked}
                    className={cn(
                      'rounded-sm border-primary',
                      !checked && 'opacity-50',
                    )}
                    onCheckedChange={(nextChecked) => {
                      const nextValues = nextChecked
                        ? [...field.value, option.value]
                        : field.value.filter((value) => value !== option.value);
                      field.onChange(nextValues);
                      field.onBlur();
                    }}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={id}>{option.label}</FieldLabel>
                    <FieldDescription>{option.description}</FieldDescription>
                  </FieldContent>
                </Field>
              );
            })}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {submitLabel}
            </Button>
          </FieldGroup>
        )}
      />
    </form>
  );
}
