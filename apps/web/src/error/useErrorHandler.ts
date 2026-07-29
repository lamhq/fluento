export type ErrorHandlerFunction = (error: unknown) => void;

/**
 * Hook that returns a function to handle errors in event handlers.
 * The error is passed to the error handlers configured in ErrorProvider.
 * Must be used within an ErrorProvider.
 * @returns Object containing the handleError function
 */
export default function useErrorHandler(): ErrorHandlerFunction {
  const handleError = (error: unknown) => {
    console.error('Error caught by useErrorHandler:', error);
  };

  return handleError;
}
