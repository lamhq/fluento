import { useContext } from 'react';

import { ApiClientContext } from './contexts';
import type { ApiClient } from './types';

export function useApiClient(): ApiClient {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
}
