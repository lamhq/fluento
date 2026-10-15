import { Controller, type UseFormReturn } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';

import LinesInput from '../../../common/components/LinesInput';
import type { ExerciseFormData } from './exerciseFormSchema';

type AllowedFields =
  'prompts' | 'validResponses' | 'sentences' | 'clues' | 'words' | 'references';

export default function LinesFormField({
  form,
  name,
  label,
  required = true,
  placeholder,
  className,
}: {
  form: UseFormReturn<ExerciseFormData>;
  name: AllowedFields;
  label: string;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const controlId = `exercise-${name}`;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={controlId}>
            {label}
            {required && (
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            )}
          </FieldLabel>
          <LinesInput
            {...field}
            id={controlId}
            placeholder={placeholder}
            required={required}
            aria-required={required}
            aria-invalid={fieldState.invalid}
            className={className}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
