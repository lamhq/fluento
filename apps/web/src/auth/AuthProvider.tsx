import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useEffect, useMemo } from 'react';
import type { AuthProviderProps as ReactOidcAuthProviderProps } from 'react-oidc-context';
import { AuthProvider as ReactOidcAuthProvider } from 'react-oidc-context';

import IndexedDBStorage from './IndexedDBStorage';

export interface AuthProviderProps {
  /**
   * React children elements that will be wrapped by the AuthProvider.
   * Typically your application components that need access to authentication context.
   */
  children: React.ReactNode;

  /**
   * The base URL of the OpenID Connect (OIDC) authority (identity provider).
   * Example: "https://cognito-idp.{region}.amazonaws.com/{cognito-user-pool-id}"
   */
  oidcAuthority: string;

  /**
   * The client ID registered with the OIDC provider.
   * This uniquely identifies your application during the authentication flow.
   */
  oidcClientId: string;

  /**
   * The redirect URI where the OIDC provider will redirect user after successful authentication.
   * It receives the code, used for exchanging access token.
   */
  redirectUri: string;

  /**
   * Optional callback executed after a successful sign-in.
   * Receives the authenticated user object (or undefined if unavailable).
   * Can be used to attach tokens to API requests or trigger side effects.
   */
  onSigninCallback?: (user: User | null | undefined) => Promise<void> | void;
}

export default function AuthProvider(props: AuthProviderProps) {
  const { oidcAuthority, oidcClientId, redirectUri, onSigninCallback } = props;

  const userManager = useMemo(
    () =>
      new UserManager({
        authority: oidcAuthority,
        client_id: oidcClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'email openid profile',
        userStore: new WebStorageStateStore({ store: new IndexedDBStorage() }),
      }),
    [oidcAuthority, oidcClientId, redirectUri],
  );

  const oidcConfig: ReactOidcAuthProviderProps = {
    userManager,
    // Skip exchanging the authorization token unless the page is the OIDC callback redirect URI,
    skipSigninCallback: !window.location.href.includes(redirectUri),
    // Extract the access token from the user object and attach it to the API request
    onSigninCallback: onSigninCallback,
  };

  useEffect(() => {
    // attach token to API request on load
    userManager.getUser().then(onSigninCallback, console.error);
  }, [userManager, onSigninCallback]);

  return (
    <ReactOidcAuthProvider {...oidcConfig}>{props.children}</ReactOidcAuthProvider>
  );
}
