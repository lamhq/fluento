import { useAuth } from '../auth';
import {
  ForbiddenError,
  NetworkError,
  NotFoundError,
  ServerError,
  UnAuthorizedError,
} from './types';
import { showErrorToast } from './utils';

export default function useErrorHandler<Args extends unknown[], Result>(
  asyncFunction: (...args: Args) => Promise<Result>,
): (...args: Args) => Promise<Result | undefined> {
  const { signIn } = useAuth();

  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      if (error instanceof UnAuthorizedError) {
        showErrorToast(error.message, 'Sign-in required');
        await signIn();
      } else if (error instanceof NetworkError) {
        showErrorToast(error.message, 'Connection problem');
      } else if (error instanceof ForbiddenError) {
        showErrorToast(error.message, 'Access denied');
      } else if (error instanceof NotFoundError) {
        showErrorToast(error.message, 'Not found');
      } else if (error instanceof ServerError) {
        showErrorToast(error.message, 'Server error');
      } else {
        showErrorToast('Something went wrong. Please try again.');
        // TODO: send error to monitoring services
        console.error(error);
      }
    }
  };
}
