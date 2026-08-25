import { Controller } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';

import type { PracticeExercise } from '../../hooks';
import { usePracticeForm } from './usePracticeForm';

export interface PracticeFormProps {
  exercise: PracticeExercise;
}

export default function PracticeForm({ exercise }: PracticeFormProps) {
  const {
    form,
    handleSubmit,
    prompt,
    counterpart,
    scenario,
    learnerRole,
    response,
    feedback,
    next,
  } = usePracticeForm({ exercise });

  return (
    <>
      <Card size="sm">
        <CardHeader className="border-b">
          <CardTitle className="text-center">{scenario}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            You&apos;re a <strong className="italic">{learnerRole}</strong>{' '}
            {scenario.toLowerCase()}.
          </p>
          <p>
            The <strong className="italic">{counterpart}</strong> said:
          </p>
          <blockquote className="my-4 italic font-bold text-center text-lg">
            {prompt}
          </blockquote>

          <form id="practice-form" onSubmit={handleSubmit} noValidate>
            <Controller
              name="response"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="practice-form-response">
                    Response in a polite manner:
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="practice-form-response"
                      placeholder="Type your response here..."
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {response.length}/32 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button
            type="submit"
            form="practice-form"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            Submit
          </Button>
          <Button type="button" variant="secondary" className="hidden">
            Retry
          </Button>
          {feedback && (
            <Button type="button" variant="outline" onClick={next}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>

      {feedback && (
        <div className="mt-6">
          <Alert>
            <AlertTitle>🌟 {feedback.score}/100.</AlertTitle>
            <AlertDescription>{feedback.feedback}</AlertDescription>
          </Alert>

          <div className="mt-4 space-y-2">
            {feedback.correctness.fixes.length > 0 && (
              <>
                <p>Corrected Sentence:</p>
                <p>&quot;{feedback.correctness.correctedSentence}&quot;</p>

                <p className="mt-2">Fixes:</p>
                <ul className="list-disc list-inside">
                  {feedback.correctness.fixes.map((fix) => (
                    <li key={fix}>{fix}</li>
                  ))}
                </ul>
              </>
            )}

            {exercise.expectedResponses.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-semibold">Here're what you can say:</p>
                <ul className="list-disc list-inside space-y-1">
                  {exercise.expectedResponses.map((expectedResponse, index) => (
                    <li key={`alternative-${index.toString()}`}>
                      {expectedResponse.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
