import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserManager } from 'oidc-client-ts';
import { AuthContext, type AuthContextProps } from 'react-oidc-context';
import { MemoryRouter } from 'react-router';

import { ApiProvider, AxiosClient } from '../src/api';
import { type AuthConfig, AuthProvider } from '../src/auth';
import { ErrorProvider } from '../src/error';

export interface MockProviderProps {
  children: React.ReactNode;
}

const apiClient = new AxiosClient({ baseUrl: '/api' });
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});
const authConfig: AuthConfig = {
  oidcAuthority: 'https://storybook.invalid',
  oidcClientId: 'storybook',
  signInUri: window.location.origin,
  signOutUri: window.location.origin,
  userManager: new UserManager({
    authority: 'https://storybook.invalid',
    client_id: 'storybook',
    redirect_uri: window.location.origin,
    post_logout_redirect_uri: window.location.origin,
    response_type: 'code',
    scope: 'openid',
  }),
};

export default function MockProvider({ children }: MockProviderProps) {
  const authContextValue = { isAuthenticated: true } as AuthContextProps;
  return (
    <ApiProvider apiClient={apiClient}>
      <MemoryRouter>
        <AuthContext.Provider value={authContextValue}>
          <AuthProvider config={authConfig}>
            <QueryClientProvider client={queryClient}>
              <ErrorProvider>{children}</ErrorProvider>
            </QueryClientProvider>
          </AuthProvider>
        </AuthContext.Provider>
      </MemoryRouter>
    </ApiProvider>
  );
}
