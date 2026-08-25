import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { useErrorHandler } from '../../../error';
import type { PracticeExercise, SubmitResponse } from '../../hooks';
import { useSubmitResponse } from '../../hooks';
import { PRACTICE_EXERCISES_QUERY_KEY } from '../../hooks';

const practiceFormSchema = z.object({
  response: z.string().trim().min(1, 'Please enter a response before submitting.'),
});

type PracticeFormValues = z.infer<typeof practiceFormSchema>;

export function usePracticeForm({ exercise }: { exercise: PracticeExercise }) {
  const prompt = exercise.prompts[0];
  const counterpart = exercise.counterpartRole;
  const { submitResponse } = useSubmitResponse();
  const form = useForm<PracticeFormValues>({
    resolver: zodResolver(practiceFormSchema),
    defaultValues: {
      response: '',
    },
    mode: 'onChange',
  });
  const response = useWatch({ control: form.control, name: 'response' });
  const [feedback, setFeedback] = useState<SubmitResponse | null>(null);
  const handleError = useErrorHandler();
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const result = await submitResponse({
        exerciseId: exercise.id,
        response: values.response,
      });
      setFeedback(result);
    } catch (error) {
      void handleError(error);
    }
  });
  const queryClient = useQueryClient();
  const next = () => {
    form.reset();
    setFeedback(null);
    void queryClient.invalidateQueries({ queryKey: PRACTICE_EXERCISES_QUERY_KEY });
  };

  return {
    form,
    handleSubmit,
    prompt,
    counterpart,
    scenario: exercise.scenario,
    learnerRole: exercise.learnerRole,
    response,
    feedback,
    next,
  };
}
