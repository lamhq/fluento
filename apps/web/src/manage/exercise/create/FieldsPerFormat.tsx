import { type UseFormReturn } from 'react-hook-form';

import { ExerciseFormat } from '../../../core/types/exercise-format';
import type { ExerciseFormData } from './exerciseFormSchema';
import LinesFormField from './LinesFormField';
import TextFormField from './TextFormField';

/**
 * Component for rendering the appropriate fields based on the exercise format.
 */
export default function FieldsPerFormat({
  format,
  form,
}: {
  format?: ExerciseFormat;
  form: UseFormReturn<ExerciseFormData>;
}) {
  if (!format) {
    return (
      <p className="text-xs text-muted-foreground">
        Select a format to show the required content fields.
      </p>
    );
  }

  switch (format) {
    case ExerciseFormat.Communication:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            placeholder="Describe the situation for this conversation."
            required
          />
          <LinesFormField
            form={form}
            name="prompts"
            label="Prompts"
            placeholder="Enter one prompt per line."
          />
          <LinesFormField
            form={form}
            name="validResponses"
            label="Valid responses"
            placeholder="Enter one valid response per line."
          />
        </>
      );
    case ExerciseFormat.Word:
      return (
        <>
          <TextFormField
            form={form}
            name="word"
            label="Word or phrase"
            required
            placeholder="Enter the vocabulary item."
          />
          <TextFormField
            form={form}
            name="meaning"
            label="Meaning"
            multiline
            required
            placeholder="Explain the word or phrase."
          />
          <LinesFormField
            form={form}
            name="sentences"
            label="Sentences"
            required={false}
            placeholder="Enter one sentence per line."
          />
          <LinesFormField
            form={form}
            name="clues"
            label="Clues"
            required={false}
            placeholder="Enter one clue per line."
          />
        </>
      );
    case ExerciseFormat.Sentence:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            required
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="sentence"
            label="Sentence"
            required
            placeholder="Enter the source sentence."
          />
          <LinesFormField
            form={form}
            name="words"
            label="Words"
            required={false}
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
    case ExerciseFormat.Paragraph:
      return (
        <>
          <TextFormField
            form={form}
            name="scenario"
            label="Scenario"
            required
            placeholder="Describe the context for this exercise."
          />
          <TextFormField
            form={form}
            name="paragraph"
            label="Paragraph"
            multiline
            required
            placeholder="Enter the source paragraph."
            className="min-h-30"
          />
          <LinesFormField
            form={form}
            name="words"
            label="Words"
            required={false}
            placeholder="Enter one word or phrase per line."
          />
        </>
      );
  }
}
