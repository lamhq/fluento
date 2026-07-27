import type { ComponentType } from 'react';
import { Route, Routes } from 'react-router';

import { requireAuth } from './auth';
import { LAST_ROUTE_KEY } from './constants';
import Home from './pages/HomePage';
import ProtectedPage from './pages/ProtectedPage';
import SignInCallbackPage from './pages/SignInCallbackPage';
import SignOutCallbackPage from './pages/SignOutCallbackPage';
import { SIGN_IN_REDIRECT_ROUTE, SIGN_OUT_REDIRECT_ROUTE } from './routes';
import MainLayout from './templates/MainLayout';

const withAuth = (comp: ComponentType) => {
  return requireAuth(comp, {
    OnRedirecting: () => <p>Redirecting to sign-in page...</p>,
    onBeforeSignin: () => {
      // save the current route for going back after signin
      window.localStorage.setItem(LAST_ROUTE_KEY, window.location.pathname);
    },
  });
};

const ProtectedPageWithAuth = withAuth(ProtectedPage);

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/protected" element={<ProtectedPageWithAuth />} />
      </Route>
      <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInCallbackPage />} />
      <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutCallbackPage />} />
    </Routes>
  );
}
