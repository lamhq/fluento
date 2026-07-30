import { type FallbackProps } from 'react-error-boundary';

import { useAuth } from '../../../auth';
import { getErrorInfo } from '../../../error';

/**
 * Default error fallback component that displays error information
 * when an error is caught by an ErrorBoundary.
 */
export default function ErrorFallback(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;
  const { title, description, errorCode } = getErrorInfo(error);
  const { signIn } = useAuth();
  const actionLabel = errorCode === 'UNAUTHORIZED_ACCESS' ? 'Sign In' : 'Try Again';
  const handleAction = () => {
    if (errorCode === 'UNAUTHORIZED_ACCESS') {
      void signIn();
    } else {
      resetErrorBoundary();
    }
  };

  return (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>{description}</p>
      <button
        onClick={handleAction}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
