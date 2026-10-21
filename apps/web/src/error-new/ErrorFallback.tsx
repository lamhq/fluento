import type { FallbackProps } from 'react-error-boundary';

import ForbiddenErrorScreen from './ForbiddenErrorScreen';
import GeneralErrorScreen from './GeneralErrorScreen';
import NotFoundErrorScreen from './NotFoundErrorScreen';
import { ForbiddenError, NotFoundError, UnAuthorizedError } from './types';
import UnauthorizedErrorScreen from './UnauthorizedErrorScreen';

export default function ErrorFallback({ error }: FallbackProps) {
  if (error instanceof UnAuthorizedError) {
    return <UnauthorizedErrorScreen />;
  }

  if (error instanceof ForbiddenError) {
    return <ForbiddenErrorScreen />;
  }

  if (error instanceof NotFoundError) {
    return <NotFoundErrorScreen />;
  }

  return <GeneralErrorScreen />;
}
