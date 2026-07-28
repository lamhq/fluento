import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

import IndexedDBStorage from './IndexedDBStorage';
import type { AuthConfig, AuthParams } from './types';

export async function initializeAuth(authOptions: AuthParams): Promise<AuthConfig> {
  const { oidcAuthority, oidcClientId, signInUri, signOutUri, onAccessToken } =
    authOptions;
  const userManager = new UserManager({
    authority: oidcAuthority,
    client_id: oidcClientId,
    redirect_uri: signInUri,
    post_logout_redirect_uri: signOutUri,
    response_type: 'code',
    scope: 'email openid profile',
    userStore: new WebStorageStateStore({ store: new IndexedDBStorage() }),
  });

  // Register for UserLoaded event
  userManager.events.addUserLoaded((user) => {
    if (user.id_token && onAccessToken) {
      // trigger callback function every time access token changed
      onAccessToken(user.id_token);
    }
  });

  // Load user info from browser storage
  const user = await userManager.getUser(false);
  if (user?.id_token && onAccessToken) {
    // trigger callback function on page load
    onAccessToken(user.id_token);
  }

  return {
    ...authOptions,
    userManager,
  };
}
