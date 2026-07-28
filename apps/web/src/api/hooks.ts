import type { AxiosInstance } from 'axios';
import { useContext } from 'react';

import { ApiClientContext } from './contexts';

export function useApiClient(): AxiosInstance {
  const context = useContext(ApiClientContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiClientProvider');
  }
  return context;
}
