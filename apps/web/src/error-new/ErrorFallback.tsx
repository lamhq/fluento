import type { FallbackProps } from 'react-error-boundary';

import ForbiddenErrorScreen from './ForbiddenErrorScreen';
import GeneralErrorScreen from './GeneralErrorScreen';
import NetworkErrorScreen from './NetworkErrorScreen';
import NotFoundErrorScreen from './NotFoundErrorScreen';
import {
  ForbiddenError,
  NetworkError,
  NotFoundError,
  UnAuthorizedError,
} from './types';
import UnauthorizedErrorScreen from './UnauthorizedErrorScreen';

export default function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  if (error instanceof UnAuthorizedError) {
    return <UnauthorizedErrorScreen />;
  }

  if (error instanceof NetworkError) {
    return <NetworkErrorScreen onRetry={resetErrorBoundary} />;
  }

  if (error instanceof ForbiddenError) {
    return <ForbiddenErrorScreen />;
  }

  if (error instanceof NotFoundError) {
    return <NotFoundErrorScreen />;
  }

  return <GeneralErrorScreen onRetry={resetErrorBoundary} />;
}
