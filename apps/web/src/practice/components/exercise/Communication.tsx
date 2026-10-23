import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError } from '@/components/ui/field';
import { InputGroup, InputGroupInput } from '@/components/ui/input-group';

import SubmitButton from '../../../common/components/Button';
import type { PracticeExercise } from '../../../core/types/practice-exercise';
import { useErrorHandler } from '../../../error-new';
import { useResetPracticeExercise, useSubmitResponse } from '../../hooks';
import { normalizeLearnerResponse } from '../../utils';
import ResponseFeedback from '../ResponseFeedback';

const formSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type FormValues = z.infer<typeof formSchema>;

interface CommunicationProps {
  exercise: PracticeExercise;
}

export default function Communication({ exercise }: CommunicationProps) {
  const submitResponse = useSubmitResponse();
  const resetPracticeExercise = useResetPracticeExercise();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { response: '' },
    mode: 'onChange',
  });
  const [feedback, setFeedback] = useState<Awaited<
    ReturnType<typeof submitResponse>
  > | null>(null);

  const submit = useErrorHandler(async (values: FormValues) => {
    const result = await submitResponse({
      exerciseId: exercise.id,
      practiceType: exercise.type,
      response: normalizeLearnerResponse(values.response),
    });
    setFeedback(result);
  });

  const handleNext = () => {
    form.reset();
    setFeedback(null);
    resetPracticeExercise();
  };

  const isSubmitting = form.formState.isSubmitting;
  const submitButtonLabel = isSubmitting
    ? 'Processing...'
    : feedback
      ? 'Retry'
      : 'Submit';
  const prompt = exercise.prompts?.[0] ?? '';
  const topics = exercise.topics;

  return (
    <>
      <Card size="sm" className="mb-4">
        <CardHeader className="border-b text-center">
          <CardTitle>{exercise.name}</CardTitle>
          {topics.length > 0 && (
            <CardDescription className="mt-1">
              {topics.map((topic) => (
                <Badge
                  key={topic}
                  variant="outline"
                  className="mr-1 text-xs text-muted-foreground"
                >
                  {topic}
                </Badge>
              ))}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <form id="practice-form" onSubmit={form.handleSubmit(submit)} noValidate>
            <p className="text-xs tracking-wide text-muted-foreground">
              Communicate in a real-life conversation.
            </p>

            <p className="my-4 text-center text-lg text-foreground">{prompt}</p>

            <Controller
              name="response"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupInput
                      {...field}
                      id="practice-form-response"
                      type="text"
                      placeholder="Type your response here..."
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      aria-label="Your response"
                    />
                  </InputGroup>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center gap-2">
          <SubmitButton
            type="submit"
            form="practice-form"
            disabled={!form.formState.isValid}
            isLoading={isSubmitting}
          >
            {submitButtonLabel}
          </SubmitButton>
          {feedback && (
            <Button type="button" variant="outline" onClick={handleNext}>
              Next
            </Button>
          )}
        </CardFooter>
      </Card>

      {feedback && (
        <ResponseFeedback
          feedback={feedback}
          validResponses={exercise.validResponses ?? []}
        />
      )}
    </>
  );
}
