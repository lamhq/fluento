import { type UseFormReturn } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import Controller from '../../../common/components/Controller';
import type { ExerciseFormData } from './exerciseFormSchema';

type AllowedFields = 'scenario' | 'word' | 'meaning' | 'sentence' | 'paragraph';

export default function TextFormField({
  form,
  name,
  label,
  multiline,
  required,
  placeholder,
  className,
}: {
  form: UseFormReturn<ExerciseFormData>;
  name: AllowedFields;
  label: string;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const controlId = `exercise-${name}`;

  return (
    <Controller
      name={name}
      control={form.control}
      defaultValue=""
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
          {multiline ? (
            <Textarea
              {...field}
              id={controlId}
              placeholder={placeholder}
              required={required}
              aria-required={required}
              aria-invalid={fieldState.invalid}
              className={className}
            />
          ) : (
            <Input
              {...field}
              id={controlId}
              placeholder={placeholder}
              required={required}
              aria-required={required}
              aria-invalid={fieldState.invalid}
              className={className}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
