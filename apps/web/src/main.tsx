import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import { AuthProvider } from './auth';
import { HttpClientProvider } from './http';
import { SIGN_IN_REDIRECT_ROUTE } from './routes';
import { getAbsoluteURL, getEnv } from './utils';

const httpClient = axios.create({
  baseURL: getEnv('VITE_API_BASE_URL'),
  headers: {
    'Content-Type': 'application/json',
  },
});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: false } },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <HttpClientProvider httpClient={httpClient}>
        <AuthProvider
          oidcAuthority={getEnv('VITE_OIDC_AUTHORITY')}
          oidcClientId={getEnv('VITE_OIDC_CLIENT_ID')}
          redirectUri={getAbsoluteURL(SIGN_IN_REDIRECT_ROUTE)}
          onSigninCallback={(user) => {
            if (user?.id_token) {
              // Attach the access token to the API request headers
              httpClient.defaults.headers.common.Authorization = `Bearer ${user.id_token}`;
            } else {
              // Remove the access token from the API request headers
              delete httpClient.defaults.headers.common.Authorization;
            }
          }}
        >
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </BrowserRouter>
        </AuthProvider>
      </HttpClientProvider>
    </StrictMode>,
  );
}
