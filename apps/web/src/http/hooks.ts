import type { AxiosInstance } from 'axios';
import { useContext } from 'react';

import { HttpClientContext } from './contexts';

export function useHttpClient(): AxiosInstance {
  const context = useContext(HttpClientContext);
  if (!context) {
    throw new Error('useHttpClient must be used within an HttpClientProvider');
  }
  return context;
}
