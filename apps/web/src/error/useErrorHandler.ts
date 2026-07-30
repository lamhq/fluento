import { useAuth } from '../auth';
import { getErrorInfo } from '.';

export type ErrorHandlerFunction = (error: unknown) => Promise<void>;

/**
 * Hook that returns a function to handle errors in event handlers.
 */
export default function useErrorHandler(): ErrorHandlerFunction {
  const { signIn } = useAuth();

  const handleError = async (error: unknown) => {
    const { title, description, errorCode } = getErrorInfo(error);
    const message = `${title}. ${description}`;
    if (errorCode === 'UNAUTHORIZED_ACCESS') {
      console.log('show alert:', message);
      await signIn();
    } else {
      console.log('show toast:', message);
    }
  };

  return handleError;
}
