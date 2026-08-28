import { type FallbackProps } from 'react-error-boundary';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { useAuth } from '../../../auth';
import { getErrorInfo } from '../../../error';

/**
 * Default error fallback component that displays error information
 * when an error is caught by an ErrorBoundary.
 */
export default function ErrorFallback(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;
  const { message, code } = getErrorInfo(error);
  const { signIn } = useAuth();
  const actionLabel = code === 'UNAUTHORIZED_ACCESS' ? 'Sign In' : 'Try Again';

  const handleAction = () => {
    if (code === 'UNAUTHORIZED_ACCESS') {
      void signIn();
    } else {
      resetErrorBoundary();
    }
  };

  return (
    <Alert
      variant="destructive"
      className="max-w-lg mx-auto border-destructive/20 bg-destructive/5 shadow-sm"
    >
      <AlertTitle className="text-base font-semibold">Error</AlertTitle>

      <AlertDescription className="mt-2 text-sm text-muted-foreground">
        {message}
      </AlertDescription>

      <div className="mt-4 flex justify-center">
        <Button type="button" onClick={handleAction} variant="destructive">
          {actionLabel}
        </Button>
      </div>
    </Alert>
  );
}
