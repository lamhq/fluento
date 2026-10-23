import './global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';

import { Toaster } from '@/components/ui/toast';

import { ApiProvider, AxiosClient } from './api';
import { AuthProvider, initializeAuth } from './auth';
import { LAST_ROUTE_KEY } from './common/constants';
import { getAbsoluteURL, getEnv } from './common/utils';
import { router } from './router';
import { SIGN_IN_REDIRECT_ROUTE, SIGN_OUT_REDIRECT_ROUTE } from './routes';

const httpClient = new AxiosClient({ baseUrl: getEnv('VITE_API_BASE_URL') });

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: false } },
});

const authConfig = await initializeAuth({
  oidcAuthority: getEnv('VITE_OIDC_AUTHORITY'),
  oidcClientId: getEnv('VITE_OIDC_CLIENT_ID'),
  signInUri: getAbsoluteURL(SIGN_IN_REDIRECT_ROUTE),
  signOutUri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),
  redirectFallback: () => <p>Redirecting to sign-in page...</p>,
  onAccessToken: (token) => {
    httpClient.setAccessToken(token);
  },
  onBeforeSignIn: () => {
    // Save the current route for going back after signin
    window.localStorage.setItem(LAST_ROUTE_KEY, window.location.pathname);
  },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ApiProvider apiClient={httpClient}>
        <AuthProvider config={authConfig}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <Toaster />
          </QueryClientProvider>
        </AuthProvider>
      </ApiProvider>
    </StrictMode>,
  );
}
