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
import { InputGroup, InputGroupTextarea } from '@/components/ui/input-group';

import type { PracticeExercise } from '../../../api/types';
import SubmitButton from '../../../common/components/Button';
import { useErrorHandler } from '../../../error';
import { useResetPracticeExercise, useSubmitResponse } from '../../hooks';
import { normalizeLearnerResponse } from '../../utils';
import ColoredBadges from '../ColoredBadges';
import ResponseFeedback from '../ResponseFeedback';

const formSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type FormValues = z.infer<typeof formSchema>;

interface SentenceConstructionProps {
  exercise: PracticeExercise;
}

export default function SentenceConstruction({
  exercise,
}: SentenceConstructionProps) {
  const submitResponse = useSubmitResponse();
  const resetPracticeExercise = useResetPracticeExercise();
  const handleError = useErrorHandler();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { response: '' },
    mode: 'onChange',
  });
  const [feedback, setFeedback] = useState<Awaited<
    ReturnType<typeof submitResponse>
  > | null>(null);
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setFeedback(
        await submitResponse({
          exerciseId: exercise.id,
          response: normalizeLearnerResponse(values.response),
        }),
      );
    } catch (error) {
      void handleError(error);
    }
  });
  const handleNext = () => {
    form.reset();
    setFeedback(null);
    resetPracticeExercise();
  };
  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <Card size="sm" className="mb-4">
        <CardHeader className="border-b text-center">
          <CardTitle>{exercise.name}</CardTitle>
          {exercise.topics.length > 0 && (
            <CardDescription className="mt-1">
              {exercise.topics.map((topic) => (
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
          <form
            id="practice-form"
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
            <p className="text-xs tracking-wide text-muted-foreground">
              Make a sentence using the following words:
            </p>
            <div className="flex flex-wrap gap-2 my-4 justify-center">
              <ColoredBadges values={exercise.words ?? []} />
            </div>
            <Controller
              name="response"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="practice-form-response"
                      placeholder="Type your response here..."
                      rows={4}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
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
            {isSubmitting ? 'Processing...' : feedback ? 'Retry' : 'Submit'}
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
