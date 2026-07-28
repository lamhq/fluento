import React, { useEffect } from 'react';
import { hasAuthParams } from 'react-oidc-context';
import { useAuth } from 'react-oidc-context';

import type { AuthConfig } from './types';
import { useAuthConfig } from './useAuthConfig';

export type RequireAuthArgs = Pick<
  AuthConfig,
  'signinRedirectArgs' | 'redirectFallback' | 'onBeforeSignIn'
>;

/**
 * A public higher-order component to protect accessing not public content.
 * When you wrap your components in this higher-order component and an anonymous
 * user visits your component, they will be redirected to the login page; after
 * logging in, they will return to the page from which they were redirected.
 */
export default function requireAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: RequireAuthArgs = {},
): React.FC<P> {
  const displayName = `requireAuth(${Component.displayName ?? Component.name})`;

  const WrapperComponent: React.FC<P> = (props) => {
    const auth = useAuth();
    const config = useAuthConfig();
    const redirectFallback =
      options.redirectFallback ?? config.redirectFallback ?? (() => undefined);

    useEffect(() => {
      if (
        hasAuthParams() ||
        auth.isLoading ||
        auth.activeNavigator ||
        auth.isAuthenticated
      ) {
        return;
      }

      void (async (): Promise<void> => {
        const onBeforeSignIn =
          options.onBeforeSignIn ?? config.onBeforeSignIn ?? (() => undefined);
        const signinRedirectArgs =
          options.signinRedirectArgs ?? config.signinRedirectArgs;
        const result = onBeforeSignIn();
        if (result instanceof Promise) {
          await result;
        }
        await auth.signinRedirect(signinRedirectArgs);
      })();
    }, [auth, config.onBeforeSignIn, config.signinRedirectArgs]);

    return auth.isAuthenticated ? (
      <Component {...props} />
    ) : auth.activeNavigator?.includes('signin') ? (
      redirectFallback()
    ) : null;
  };

  WrapperComponent.displayName = displayName;
  return WrapperComponent;
}
