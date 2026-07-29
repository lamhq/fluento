import { useContext } from 'react';

import { ErrorConfigContext } from './contexts';
import type { ErrorConfig } from './types';

/**
 * Hook to access the error configuration from the nearest ErrorProvider.
 * @throws Error if used outside of an ErrorProvider
 * @returns The error configuration
 */
export function useErrorConfig(): ErrorConfig {
  const config = useContext(ErrorConfigContext);

  if (!config) {
    throw new Error('useErrorConfig must be used within an ErrorProvider');
  }

  return config;
}
