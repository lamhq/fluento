import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, type UseFormReturn, useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import type {
  CreateExerciseInput,
  Exercise,
  ExerciseFormat,
  ExerciseSkill,
  ExerciseStatus,
} from '../../../api/types';
import { useCreateExercise, useTopicsQuery } from '../hooks';
import {
  cleanLines,
  exerciseFormSchema,
  formatsBySkill,
  type FormValues,
  type TextFieldName,
} from './exerciseFormSchema';

const skills: { label: string; value: ExerciseSkill }[] = [
  { label: 'Communication', value: 'communication' },
  { label: 'Vocabulary', value: 'vocabulary' },
  { label: 'Articulation', value: 'articulation' },
];

const formatLabels: Record<ExerciseFormat, string> = {
  communication: 'Communication',
  word: 'Word',
  sentence: 'Sentence',
  paragraph: 'Paragraph',
};

const statuses: { label: string; value: ExerciseStatus }[] = [
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
];

const contentFields = [
  'scenario',
  'prompts',
  'validResponses',
  'word',
  'meaning',
  'sentences',
  'clues',
  'sentence',
  'paragraph',
  'words',
] as const satisfies TextFieldName[];

function defaultValues(exercise?: Exercise): FormValues {
  return {
    name: exercise?.name ?? '',
    skill: exercise?.skill ?? '',
    format: exercise?.format ?? '',
    topics: exercise?.topics ?? [],
    references: '',
    status: exercise?.status ?? 'active',
    scenario: '',
    prompts: '',
    validResponses: '',
    word: '',
    meaning: '',
    sentences: '',
    clues: '',
    sentence: '',
    paragraph: '',
    words: '',
  };
}

function toCreateExerciseInput(values: FormValues): CreateExerciseInput {
  const references = cleanLines(values.references);
  const common = {
    name: values.name.trim(),
    topics: values.topics.map((topic) => topic.trim()).filter(Boolean),
    ...(references.length > 0 ? { references } : {}),
    status: values.status,
  };

  switch (values.format) {
    case 'communication':
      if (values.skill === 'communication') {
        return {
          ...common,
          skill: 'communication',
          format: 'communication',
          scenario: values.scenario.trim(),
          prompts: cleanLines(values.prompts),
          validResponses: cleanLines(values.validResponses),
        };
      }
      break;
    case 'word':
      if (values.skill === 'vocabulary') {
        return {
          ...common,
          skill: 'vocabulary',
          format: 'word',
          word: values.word.trim(),
          meaning: values.meaning.trim(),
          sentences: cleanLines(values.sentences),
          clues: cleanLines(values.clues),
        };
      }
      break;
    case 'sentence':
      if (values.skill === 'articulation') {
        return {
          ...common,
          skill: 'articulation',
          format: 'sentence',
          scenario: values.scenario.trim(),
          sentence: values.sentence.trim(),
          words: cleanLines(values.words),
        };
      }
      break;
    case 'paragraph':
      if (values.skill === 'articulation') {
        return {
          ...common,
          skill: 'articulation',
          format: 'paragraph',
          scenario: values.scenario.trim(),
          paragraph: values.paragraph.trim(),
          words: cleanLines(values.words),
        };
      }
      break;
  }

  throw new Error('Select a format compatible with the chosen skill.');
}

function errorMessage(error: unknown): string {
  if (
    axios.isAxiosError<{ message?: string; details?: Record<string, unknown> }>(
      error,
    )
  ) {
    const response = error.response?.data;
    const details = response?.details
      ? Object.entries(response.details)
          .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
          .map(([field, message]) => `${field}: ${message}`)
      : [];

    if (details.length > 0) {
      return `${response?.message ?? 'Request validation failed'}: ${details.join('; ')}`;
    }

    if (response?.message) {
      return response.message;
    }
  }

  return error instanceof Error
    ? error.message
    : 'Unable to create exercise. Check your connection and try again.';
}

function TextFormField({
  form,
  name,
  label,
  multiline = false,
  required = true,
  placeholder,
  rows = 3,
}: {
  form: UseFormReturn<FormValues>;
  name: TextFieldName;
  label: string;
  multiline?: boolean;
  required?: boolean;
  placeholder?: string;
  rows?: number;
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
            {required && <span aria-hidden="true"> *</span>}
          </FieldLabel>
          {multiline ? (
            <Textarea
              {...field}
              id={controlId}
              rows={rows}
              placeholder={placeholder}
              required={required}
              disabled={form.formState.isSubmitting}
              aria-required={required}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <Input
              {...field}
              id={controlId}
              placeholder={placeholder}
              required={required}
              disabled={form.formState.isSubmitting}
              aria-required={required}
              aria-invalid={fieldState.invalid}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

function FormatContentFields({
  format,
  form,
}: {
  format: ExerciseFormat;
  form: UseFormReturn<FormValues>;
}) {
  switch (format) {
    case 'communication':
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            multiline
            placeholder="Describe the situation for this conversation."
          />
          <TextFormField
            form={form}
            name="prompts"
            label="Prompts"
            multiline
            placeholder="Enter one prompt per line."
          />
          <TextFormField
            form={form}
            name="validResponses"
            label="Valid responses"
            multiline
            placeholder="Enter one valid response per line."
          />
        </>
      );
    case 'word':
      return (
        <>
          <TextFormField
            form={form}
            name="word"
            label="Word or phrase"
            placeholder="Enter the vocabulary item."
          />
          <TextFormField
            form={form}
            name="meaning"
            label="Meaning"
            multiline
            placeholder="Explain the word or phrase."
          />
          <TextFormField
            form={form}
            name="sentences"
            label="Sentences"
            multiline
            placeholder="Enter one sentence per line."
          />
          <TextFormField
            form={form}
            name="clues"
            label="Clues"
            multiline
            placeholder="Enter one clue per line."
          />
        </>
      );
    case 'sentence':
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            multiline
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="sentence"
            label="Sentence"
            multiline
            placeholder="Enter the source sentence."
          />
          <TextFormField
            form={form}
            name="words"
            label="Words"
            multiline
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
    case 'paragraph':
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            multiline
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="paragraph"
            label="Paragraph"
            multiline
            placeholder="Enter the source paragraph."
          />
          <TextFormField
            form={form}
            name="words"
            label="Words"
            multiline
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
  }
}

interface ExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exercise?: Exercise;
}

export default function ExerciseFormDialog({
  open,
  onOpenChange,
  exercise,
}: ExerciseDialogProps) {
  const isUpdate = Boolean(exercise?.id);
  const createExercise = useCreateExercise();
  const topicsQuery = useTopicsQuery();
  const [topicPickerOpen, setTopicPickerOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState('');
  const form = useForm<FormValues>({
    resolver: zodResolver(exerciseFormSchema),
    defaultValues: defaultValues(exercise),
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues(exercise));
      form.clearErrors();
    }
  }, [exercise, form, open]);

  const isSaving = form.formState.isSubmitting || createExercise.isPending;
  const selectedSkill = useWatch({
    control: form.control,
    name: 'skill',
  });
  const selectedFormat = useWatch({
    control: form.control,
    name: 'format',
  });

  const handleOpenChange = (nextOpen: boolean, skipDiscardConfirmation = false) => {
    if (!nextOpen) {
      if (isSaving) {
        return;
      }
      if (
        !skipDiscardConfirmation &&
        form.formState.isDirty &&
        !window.confirm('Discard your changes?')
      ) {
        return;
      }
      setTopicSearch('');
      setTopicPickerOpen(false);
    }
    onOpenChange(nextOpen);
  };

  const clearFormatValues = () => {
    for (const field of contentFields) {
      form.setValue(field, '', { shouldDirty: true, shouldValidate: false });
    }
    form.clearErrors(contentFields);
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors('root.server');
    try {
      await createExercise.mutateAsync(toCreateExerciseInput(values));
      handleOpenChange(false, true);
    } catch (error) {
      form.setError('root.server', { message: errorMessage(error) });
    }
  });

  const selectedTopics = useWatch({
    control: form.control,
    name: 'topics',
  });
  const topicOptions = [
    ...new Set([
      ...(topicsQuery.data ?? []).map((topic) => topic.name),
      ...selectedTopics,
    ]),
  ];
  const normalizedSearch = topicSearch.trim();
  const hasSearchMatch = topicOptions.some(
    (topic) => topic.toLocaleLowerCase() === normalizedSearch.toLocaleLowerCase(),
  );

  const addTopic = (topic: string) => {
    const value = topic.trim();
    if (!value) {
      return;
    }

    const exists = selectedTopics.some(
      (selected) => selected.toLocaleLowerCase() === value.toLocaleLowerCase(),
    );
    if (!exists) {
      form.setValue('topics', [...selectedTopics, value], {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
    setTopicSearch('');
    setTopicPickerOpen(false);
  };

  const toggleTopic = (topic: string) => {
    const selected = selectedTopics.some(
      (value) => value.toLocaleLowerCase() === topic.toLocaleLowerCase(),
    );
    form.setValue(
      'topics',
      selected
        ? selectedTopics.filter(
            (value) => value.toLocaleLowerCase() !== topic.toLocaleLowerCase(),
          )
        : [...selectedTopics, topic],
      { shouldDirty: true, shouldTouch: true, shouldValidate: true },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        handleOpenChange(nextOpen);
      }}
    >
      <DialogContent
        className="grid max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 sm:max-w-2xl"
        showCloseButton={!isSaving}
      >
        <DialogHeader className="text-start">
          <DialogTitle>
            {isUpdate ? 'Update exercise' : 'Create Exercise'}
          </DialogTitle>
          <DialogDescription>
            {isUpdate
              ? `Update "${exercise?.name ?? ''}" exercise.`
              : 'Create a new exercise.'}
          </DialogDescription>
        </DialogHeader>

        {isUpdate ? (
          <div className="min-h-0 overflow-y-auto py-1">
            <form id="exercise-form" />
          </div>
        ) : (
          <form
            id="exercise-form"
            className="min-h-0 overflow-y-auto px-1 py-1"
            onSubmit={handleSubmit}
            noValidate
          >
            <FieldGroup className="gap-4">
              <p className="text-xs text-muted-foreground">
                Fields marked with <span aria-hidden="true">*</span> are required.
              </p>

              <TextFormField form={form} name="name" label="Name" />

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  name="skill"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="exercise-skill">
                        Skill <span aria-hidden="true">*</span>
                      </FieldLabel>
                      <Select
                        value={field.value || null}
                        onValueChange={(value) => {
                          if (!value) {
                            return;
                          }
                          clearFormatValues();
                          form.setValue('format', '', {
                            shouldDirty: true,
                            shouldValidate: false,
                          });
                          field.onChange(value);
                          void form.trigger(['skill', 'format']);
                        }}
                      >
                        <SelectTrigger
                          id="exercise-skill"
                          ref={field.ref}
                          aria-required="true"
                          aria-invalid={fieldState.invalid}
                          disabled={isSaving}
                          className="w-full"
                        >
                          <SelectValue placeholder="Select a skill" />
                        </SelectTrigger>
                        <SelectContent>
                          {skills.map((skill) => (
                            <SelectItem key={skill.value} value={skill.value}>
                              {skill.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {selectedSkill && (
                  <Controller
                    name="format"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="exercise-format">
                          Format <span aria-hidden="true">*</span>
                        </FieldLabel>
                        <Select
                          value={field.value || null}
                          onValueChange={(value) => {
                            if (!value) {
                              return;
                            }
                            clearFormatValues();
                            field.onChange(value);
                            void form.trigger('format');
                          }}
                        >
                          <SelectTrigger
                            id="exercise-format"
                            ref={field.ref}
                            aria-required="true"
                            aria-invalid={fieldState.invalid}
                            disabled={isSaving}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select a format" />
                          </SelectTrigger>
                          <SelectContent>
                            {formatsBySkill[selectedSkill].map((format) => (
                              <SelectItem key={format} value={format}>
                                {formatLabels[format]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
              </div>

              <section
                className="space-y-3 border-t pt-4"
                aria-labelledby="exercise-content-heading"
              >
                <h3 id="exercise-content-heading" className="font-medium">
                  Exercise content
                </h3>
                {selectedSkill && selectedFormat ? (
                  <FormatContentFields format={selectedFormat} form={form} />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Select a skill and format to show the required content fields.
                  </p>
                )}
              </section>

              <Controller
                name="topics"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel id="exercise-topics-label">
                      Topics <span aria-hidden="true">*</span>
                    </FieldLabel>
                    <Popover
                      open={topicPickerOpen}
                      onOpenChange={setTopicPickerOpen}
                    >
                      <PopoverTrigger
                        render={
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            ref={field.ref}
                            aria-labelledby="exercise-topics-label"
                            aria-expanded={topicPickerOpen}
                            aria-invalid={fieldState.invalid}
                            disabled={isSaving}
                            className="h-auto min-h-8 w-full justify-between font-normal"
                          />
                        }
                      >
                        <span className="truncate text-left">
                          {selectedTopics.length > 0
                            ? `${String(selectedTopics.length)} ${selectedTopics.length === 1 ? 'topic' : 'topics'} selected`
                            : 'Select or add topics'}
                        </span>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-(--anchor-width) p-0"
                      >
                        <Command>
                          <CommandInput
                            value={topicSearch}
                            onValueChange={setTopicSearch}
                            placeholder="Search or add a topic..."
                            aria-label="Search or add topics"
                            disabled={isSaving}
                          />
                          <CommandList>
                            {topicsQuery.isLoading && (
                              <p
                                role="status"
                                className="px-3 py-2 text-muted-foreground"
                              >
                                Loading topics…
                              </p>
                            )}
                            <CommandEmpty>
                              {normalizedSearch
                                ? 'No matching topics.'
                                : 'No topics yet. Type a name to add one.'}
                            </CommandEmpty>
                            {topicOptions.length > 0 && (
                              <CommandGroup>
                                {topicOptions.map((topic) => (
                                  <CommandItem
                                    key={topic}
                                    value={topic}
                                    disabled={isSaving}
                                    onSelect={() => {
                                      toggleTopic(topic);
                                    }}
                                  >
                                    <span>{topic}</span>
                                    {selectedTopics.some(
                                      (selected) =>
                                        selected.toLocaleLowerCase() ===
                                        topic.toLocaleLowerCase(),
                                    ) && (
                                      <span className="ml-auto text-xs text-primary">
                                        Selected
                                      </span>
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            )}
                            {normalizedSearch && !hasSearchMatch && (
                              <CommandGroup>
                                <CommandItem
                                  value={`Add ${normalizedSearch}`}
                                  disabled={isSaving}
                                  onSelect={() => {
                                    addTopic(normalizedSearch);
                                  }}
                                >
                                  <Plus aria-hidden="true" />
                                  Add “{normalizedSearch}”
                                </CommandItem>
                              </CommandGroup>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {selectedTopics.map((topic) => (
                          <Badge key={topic} variant="outline" className="gap-1">
                            {topic}
                            <button
                              type="button"
                              className="rounded-full text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                              aria-label={`Remove ${topic}`}
                              disabled={isSaving}
                              onClick={() => {
                                form.setValue(
                                  'topics',
                                  selectedTopics.filter((value) => value !== topic),
                                  {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  },
                                );
                              }}
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    {topicsQuery.isError ? (
                      <FieldDescription role="status">
                        Unable to load saved topics. You can still add topics
                        manually.
                      </FieldDescription>
                    ) : topicsQuery.isSuccess && topicOptions.length === 0 ? (
                      <FieldDescription>
                        No saved topics found. Add a topic by typing its name.
                      </FieldDescription>
                    ) : null}
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <TextFormField
                form={form}
                name="references"
                label="References"
                multiline
                required={false}
                placeholder="Enter one reference per line."
              />

              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="exercise-status">
                      Status <span aria-hidden="true">*</span>
                    </FieldLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        if (value === 'active' || value === 'archived') {
                          field.onChange(value);
                        }
                      }}
                    >
                      <SelectTrigger
                        id="exercise-status"
                        ref={field.ref}
                        aria-required="true"
                        aria-invalid={fieldState.invalid}
                        disabled={isSaving}
                        className="w-full"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {form.formState.errors.root?.server && (
                <p className="text-xs text-destructive" role="alert">
                  {form.formState.errors.root.server.message}
                </p>
              )}
            </FieldGroup>
          </form>
        )}

        <DialogFooter className="border-t pt-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={() => {
              handleOpenChange(false);
            }}
          >
            {isUpdate ? 'Close' : 'Cancel'}
          </Button>
          {!isUpdate && (
            <Button type="submit" form="exercise-form" disabled={isSaving}>
              {isSaving ? 'Creating…' : 'Create Exercise'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
