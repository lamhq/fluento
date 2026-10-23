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
import type { Exercise } from '../../../core/types/exercise';
import {
  ExerciseFormat,
  exerciseFormats,
} from '../../../core/types/exercise-format';
import { ExerciseSkill } from '../../../core/types/exercise-skill';
import {
  ExerciseStatus,
  exerciseStatuses,
} from '../../../core/types/exercise-status';
import { useErrorHandler, useFormErrorHandler } from '../../../error';
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
  exercise?: Exercise;
  onSubmit: (values: ExerciseFormData) => Promise<void>;
}

function getDefaultValues(exercise?: Exercise): DefaultValues<ExerciseFormData> {
  const data: Exercise = exercise ?? {
    id: '',
    name: '',
    format: ExerciseFormat.Communication,
    skill: ExerciseSkill.Communication,
    topics: [],
    references: [],
    createdAt: new Date().toISOString(),
    status: ExerciseStatus.ACTIVE,
    prompts: [],
    validResponses: [],
  };

  const common = {
    topics: data.topics,
    references: data.references,
    status: data.status,
  };

  switch (data.format) {
    case ExerciseFormat.Communication:
      return {
        ...common,
        format: data.format,
        scenario: data.scenario ?? '',
        prompts: data.prompts,
        validResponses: data.validResponses,
      };
    case ExerciseFormat.Word:
      return {
        ...common,
        format: data.format,
        word: data.word,
        meaning: data.meaning,
        sentences: data.sentences,
        clues: data.clues,
      };
    case ExerciseFormat.Sentence:
      return {
        ...common,
        format: data.format,
        scenario: data.scenario,
        sentence: data.sentence ?? '',
        words: data.words,
      };
    case ExerciseFormat.Paragraph:
      return {
        ...common,
        format: data.format,
        scenario: data.scenario,
        paragraph: data.paragraph ?? '',
        words: data.words,
      };
  }
}

export default function ExerciseForm({ onSubmit, exercise }: ExerciseFormProps) {
  const form = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: getDefaultValues(exercise),
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
                  form.reset(getDefaultValues({ format } as Exercise));
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
