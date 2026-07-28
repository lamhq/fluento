import { useContext } from 'react';

import { AuthConfigContext } from './contexts';
import type { AuthConfig } from './types';

/**
 * Hook to retrieve the authentication configuration
 * Must be used within an AuthProvider.
 */
export function useAuthConfig(): AuthConfig {
  const context = useContext(AuthConfigContext);
  if (!context) {
    throw new Error('useAuthConfig must be used within an AuthProvider');
  }
  return context;
}
