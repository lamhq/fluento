import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router';

import { requireAuth } from './auth';
import ErrorFallback from './common/components/ErrorFallback';
import MainLayout from './common/components/MainLayout';
import HomePage from './common/pages/HomePage';
import SignInCallbackPage from './common/pages/SignInCallbackPage';
import SignOutCallbackPage from './common/pages/SignOutCallbackPage';
import DataFetchingPage from './demo/pages/DataFetchingPage';
import DataMutationPage from './demo/pages/DataMutationPage';
import ProtectedPage from './demo/pages/ProtectedPage';
import { SIGN_IN_REDIRECT_ROUTE, SIGN_OUT_REDIRECT_ROUTE } from './routes';

const ProtectedPageWithAuth = requireAuth(ProtectedPage);

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/data-fetching" element={<DataFetchingPage />} />
          <Route path="/data-mutation" element={<DataMutationPage />} />
          <Route path="/protected" element={<ProtectedPageWithAuth />} />
        </Route>
        <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInCallbackPage />} />
        <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutCallbackPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
