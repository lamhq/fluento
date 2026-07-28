import type { SigninRedirectArgs, UserManager } from 'oidc-client-ts';

/**
 * Parameters for initializing auth module with `initializeAuth` function.
 */
export interface AuthParams {
  /**
   * The base URL of the OpenID Connect (OIDC) authority (identity provider).
   * Example: "https://cognito-idp.{rxegion}.amazonaws.com/{cognito-user-pool-id}"
   */
  oidcAuthority: string;

  /**
   * ID of your application registered with the identity provider during the authentication flow.
   */
  oidcClientId: string;

  /**
   * Where the OIDC provider redirects user after successful authentication.
   */
  signInUri: string;

  /**
   * Where the OIDC provider redirects user after successful sign-out.
   */
  signOutUri: string;

  /**
   * Callback executed when an access token is available.
   * Used to attach tokens to API requests.
   */
  onAccessToken?: (token: string) => void;

  /**
   * Fallback component to show when redirecting to sign-in.
   */
  redirectFallback?: () => React.ReactNode;

  /**
   * Callback executed before the user is redirected to the signin page.
   */
  onBeforeSignIn?: () => Promise<void> | void;

  /**
   * Additional signin redirect arguments.
   */
  signinRedirectArgs?: SigninRedirectArgs;
}

/**
 * Props for the AuthProvider component
 * `userManager` is created in `initializeAuth` function
 */
export interface AuthConfig extends AuthParams {
  userManager: UserManager;
}
