import { zodResolver } from '@hookform/resolvers/zod';
import {
  type DefaultValues,
  type FieldPath,
  useForm,
  useWatch,
} from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import Controller from '../../../common/components/Controller';
import {
  ExerciseFormat,
  exerciseFormats,
} from '../../../core/types/exercise-format';
import {
  ExerciseStatus,
  exerciseStatuses,
} from '../../../core/types/exercise-status';
import { useErrorHandler, useFormErrorHandler } from '../../../error-new';
import { type ExerciseFormData, exerciseFormSchema } from './exerciseFormSchema';
import FieldsPerFormat from './FieldsPerFormat';
import LinesFormField from './LinesFormField';
import TopicsSelect from './TopicsSelect';

const exerciseFormFields = [
  'format',
  'topics',
  'references',
  'status',
  'scenario',
  'prompts',
  'validResponses',
  'word',
  'meaning',
  'sentences',
  'clues',
  'sentence',
  'words',
  'paragraph',
] satisfies FieldPath<ExerciseFormData>[];

interface ExerciseFormProps {
  defaultValues: DefaultValues<ExerciseFormData>;
  onSubmit: (values: ExerciseFormData) => Promise<void>;
}

function getDefaultValues(format: ExerciseFormat): ExerciseFormData {
  const common = {
    topics: [],
    references: [],
    status: ExerciseStatus.ACTIVE,
  };
  switch (format) {
    case ExerciseFormat.Communication:
      return {
        ...common,
        format,
        scenario: '',
        prompts: [],
        validResponses: [],
      };
    case ExerciseFormat.Word:
      return { ...common, format, word: '', meaning: '' };
    case ExerciseFormat.Sentence:
      return { ...common, format, scenario: '', sentence: '' };
    case ExerciseFormat.Paragraph:
      return { ...common, format, scenario: '', paragraph: '' };
  }
}

export default function ExerciseForm({
  defaultValues,
  onSubmit,
}: ExerciseFormProps) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues,
  });
  const selectedFormat = useWatch({
    control: form.control,
    name: 'format',
  });
  const handleFormError = useFormErrorHandler(form, exerciseFormFields, onSubmit);
  const handleSubmit = useErrorHandler(handleFormError);

  return (
    <form
      id="exercise-form"
      onSubmit={form.handleSubmit(handleSubmit)}
      className="h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3"
      noValidate
    >
      <FieldGroup>
        <Controller
          name="format"
          control={form.control}
          defaultValue={ExerciseFormat.Communication}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="exercise-format">
                Format
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={(format) => {
                  if (!format) return;
                  form.reset(getDefaultValues(format));
                }}
              >
                <SelectTrigger
                  id="exercise-format"
                  ref={field.ref}
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select a format" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseFormats.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <FieldsPerFormat format={selectedFormat} form={form} />

        <Controller
          name="topics"
          control={form.control}
          defaultValue={[]}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="exercise-topics">
                Topics
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <TopicsSelect
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <LinesFormField
          name="references"
          form={form}
          label="References"
          required={false}
          placeholder="Enter one reference per line."
        />

        <Controller
          name="status"
          control={form.control}
          defaultValue={ExerciseStatus.ACTIVE}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="exercise-status">
                Status
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="exercise-status"
                  ref={field.ref}
                  aria-required="true"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exerciseStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
