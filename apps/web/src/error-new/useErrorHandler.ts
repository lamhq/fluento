import { toast } from '@/components/ui/toast';

import { useAuth } from '../auth';
import { ForbiddenError, NotFoundError, UnAuthorizedError } from './types';

function showErrorToast(message: string) {
  toast.add({
    type: 'error',
    title: 'Something went wrong',
    description: message,
  });
}

export default function useErrorHandler<Args extends unknown[], Result>(
  asyncFunction: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result | undefined> {
  const { signIn } = useAuth();

  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (error instanceof UnAuthorizedError) {
        showErrorToast(error.message);
        await signIn();
      } else if (error instanceof ForbiddenError || error instanceof NotFoundError) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Something went wrong. Please try again.');
        // TODO: send error to monitoring services
        console.error(error);
      }
    }
  };
}
