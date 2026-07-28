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

  // load access token of last login session from browser storage
  const user = await userManager.getUser();

  // trigger onAccessToken event without sign-in
  if (user?.id_token && onAccessToken) {
    onAccessToken(user.id_token);
  }

  return {
    ...authOptions,
    userManager,
  };
}
