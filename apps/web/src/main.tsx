import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './App';
import { AuthProvider } from './auth';
import { initializeAuth } from './auth/utils';
import { LAST_ROUTE_KEY } from './constants';
import { HttpClientProvider } from './http';
import { SIGN_IN_REDIRECT_ROUTE, SIGN_OUT_REDIRECT_ROUTE } from './routes';
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

const authConfig = await initializeAuth({
  oidcAuthority: getEnv('VITE_OIDC_AUTHORITY'),
  oidcClientId: getEnv('VITE_OIDC_CLIENT_ID'),
  signInUri: getAbsoluteURL(SIGN_IN_REDIRECT_ROUTE),
  signOutUri: getAbsoluteURL(SIGN_OUT_REDIRECT_ROUTE),
  redirectFallback: () => <p>Redirecting to sign-in page...</p>,
  onAccessToken: (token) => {
    // Attach the access token to HTTP client for making API requests
    httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  },
  onBeforeSignIn: () => {
    // save the current route for going back after signin
    window.localStorage.setItem(LAST_ROUTE_KEY, window.location.pathname);
  },
});

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <HttpClientProvider httpClient={httpClient}>
        <AuthProvider config={authConfig}>
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
