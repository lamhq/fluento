import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

import type { AuthConfig } from './types';

interface AttachTokenProps {
  children: React.ReactNode;
  onAccessToken: AuthConfig['onAccessToken'];
}

/**
 * Component that attaches the access token to API requests.
 * Watches for changes in the user's access token and updates the authorization header.
 */
export function AttachToken({ children, onAccessToken }: AttachTokenProps) {
  const auth = useAuth();
  const accessToken = auth.user?.id_token;

  useEffect(() => {
    if (!accessToken || !onAccessToken) {
      return;
    }
    onAccessToken(accessToken);
  }, [accessToken, onAccessToken]);

  return <>{children}</>;
}
