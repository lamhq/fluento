import { Route, Routes } from 'react-router';

import { requireAuth } from './auth';
import ErrorBoundary from './common/components/ErrorBoundary';
import MainLayout from './common/components/MainLayout';
import SignInCallbackPage from './common/pages/SignInCallbackPage';
import SignOutCallbackPage from './common/pages/SignOutCallbackPage';
import HomePage from './demo/pages/HomePage';
import ProtectedPage from './demo/pages/ProtectedPage';
import ExerciseListPage from './manage/exercise/list/ExerciseListPage';
import PracticePage from './practice/pages/PracticePage';
import {
  HOME_ROUTE,
  MANAGE_EXERCISE_LIST_ROUTE,
  PRACTICE_ROUTE,
  PROTECTED_ROUTE,
  SIGN_IN_REDIRECT_ROUTE,
  SIGN_OUT_REDIRECT_ROUTE,
} from './routes';

const ProtectedPageWithAuth = requireAuth(ProtectedPage);
const ExerciseListPageWithAuth = requireAuth(ExerciseListPage);

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={HOME_ROUTE} element={<HomePage />} />
          <Route path={PROTECTED_ROUTE} element={<ProtectedPageWithAuth />} />
          <Route path={PRACTICE_ROUTE} element={<PracticePage />} />
          <Route
            path={MANAGE_EXERCISE_LIST_ROUTE}
            element={<ExerciseListPageWithAuth />}
          />
        </Route>
        <Route path={SIGN_IN_REDIRECT_ROUTE} element={<SignInCallbackPage />} />
        <Route path={SIGN_OUT_REDIRECT_ROUTE} element={<SignOutCallbackPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
