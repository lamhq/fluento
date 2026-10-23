import { useCallback, useMemo } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import { FormError } from './types';
import { showErrorToast } from './utils';

export default function useFormErrorHandler<
  T extends FieldValues,
  Args extends unknown[],
  Result,
>(
  form: UseFormReturn<T>,
  formFields: readonly FieldPath<T>[],
  asyncFunction: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result | undefined> {
  const { setError } = form;
  const fieldSet = useMemo(() => new Set<string>(formFields), [formFields]);

  return useCallback(
    async (...args: Args): Promise<Result | undefined> => {
      try {
        return await asyncFunction(...args);
      } catch (error) {
        if (!(error instanceof FormError)) {
          throw error;
        }

        showErrorToast(error.message, 'Please check your inputs');

        const isFormField = (field: string): field is FieldPath<T> =>
          fieldSet.has(field);

        let shouldFocus = true;
        for (const [field, message] of Object.entries(error.details)) {
          if (!isFormField(field)) continue;

          setError(field, { type: 'server', message }, { shouldFocus });
          shouldFocus = false;
        }
      }
    },
    [asyncFunction, fieldSet, setError],
  );
}
