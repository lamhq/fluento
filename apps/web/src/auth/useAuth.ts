import type { User } from 'oidc-client-ts';
import type { ErrorContext } from 'react-oidc-context';
import { useAuth as useAuthOidc } from 'react-oidc-context';

import { useAuthConfig } from './useAuthConfig';

export interface UseAuthReturn {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;

  /** The authenticated user object, or null if not authenticated */
  user?: User;

  /** Error information if authentication failed */
  error?: ErrorContext;

  /** Sign in to the application */
  signIn: () => Promise<void>;

  /** Sign out from the application */
  signOut: () => Promise<void>;
}

/**
 * Hook to manage authentication state and actions.
 * Wrapper around react-oidc-context's useAuth hook.
 * Must be used within an AuthProvider.
 */
export default function useAuth(): UseAuthReturn {
  const auth = useAuthOidc();
  const config = useAuthConfig();
  return {
    user: auth.user ?? undefined,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    signIn: () => auth.signinRedirect(),
    signOut: () =>
      auth.signoutRedirect({
        extraQueryParams: {
          client_id: auth.settings.client_id,
          logout_uri: config.signOutUri,
          post_logout_redirect_uri: config.signOutUri,
        },
      }),
  };
}
