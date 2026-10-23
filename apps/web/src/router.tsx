import { createBrowserRouter } from 'react-router';

import { Spinner } from '@/components/ui/spinner';

import App from './App';
import { requireAuth } from './auth';
import PageLayout from './common/components/PageLayout';
import {
  DEFAULT_ROUTE,
  EXERCISE_LIST_ROUTE,
  PRACTICE_ROUTE,
  SIGN_IN_REDIRECT_ROUTE,
  SIGN_OUT_REDIRECT_ROUTE,
} from './routes';

const hydrateFallbackElement = (
  <div className="flex min-h-screen w-full items-center justify-center">
    <Spinner className="size-8" />
  </div>
);

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PageLayout />,
        children: [
          {
            path: DEFAULT_ROUTE,
            hydrateFallbackElement,
            lazy: async () => {
              const { default: Component } =
                await import('./practice/pages/PracticePage');
              return { Component };
            },
          },
          {
            path: PRACTICE_ROUTE,
            hydrateFallbackElement,
            lazy: async () => {
              const { default: Component } =
                await import('./practice/pages/PracticePage');
              return { Component };
            },
          },
          {
            path: EXERCISE_LIST_ROUTE,
            hydrateFallbackElement,
            lazy: async () => {
              const { default: ExerciseListPage } =
                await import('./manage/exercise/list/ExerciseListPage');
              return { Component: requireAuth(ExerciseListPage) };
            },
          },
        ],
      },
      {
        path: SIGN_IN_REDIRECT_ROUTE,
        hydrateFallbackElement,
        lazy: async () => {
          const { default: Component } =
            await import('./common/pages/SignInCallbackPage');
          return { Component };
        },
      },
      {
        path: SIGN_OUT_REDIRECT_ROUTE,
        hydrateFallbackElement,
        lazy: async () => {
          const { default: Component } =
            await import('./common/pages/SignOutCallbackPage');
          return { Component };
        },
      },
    ],
  },
]);
