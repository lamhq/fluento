import { AuthProvider as ReactOidcAuthProvider } from 'react-oidc-context';

import { AttachToken } from './AttachToken';
import { AuthConfigContext } from './contexts';
import type { AuthConfig } from './types';

export interface AuthProviderProps {
  config: AuthConfig;
  children: React.ReactNode;
}

export default function AuthProvider(props: AuthProviderProps) {
  const { config, children } = props;

  return (
    <ReactOidcAuthProvider
      userManager={config.userManager}
      skipSigninCallback={!window.location.href.includes(config.signInUri)}
      onSigninCallback={() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }}
    >
      <AuthConfigContext.Provider value={config}>
        <AttachToken onAccessToken={config.onAccessToken}>{children}</AttachToken>
      </AuthConfigContext.Provider>
    </ReactOidcAuthProvider>
  );
}
