import { useAuth } from '../auth';
import { getErrorInfo } from '../error';

export type ErrorHandlerFunction = (error: unknown) => void;

/**
 * Hook that returns a function to handle errors in event handlers.
 */
export default function useErrorHandler(): ErrorHandlerFunction {
  const { signIn } = useAuth();
  const handleError = (error: unknown) => {
    const { title, description, errorCode } = getErrorInfo(error);
    alert(`${title}. ${description}`);
    if (errorCode === 'UNAUTHORIZED_ACCESS') {
      console.log('User is not authenticated. Redirecting to sign-in page...');
      void signIn();
    }
  };

  return handleError;
}
