import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useAuth } from '../../../auth';
import SignOutButton from '../../../common/components/SignOutButton';
import {
  DATA_FETCHING_ROUTE,
  DATA_MUTATION_ROUTE,
  HOME_ROUTE,
  PRACTICE_ROUTE,
  PROTECTED_ROUTE,
} from '../../../routes';
import ErrorBoundary from '../ErrorBoundary';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Home', to: HOME_ROUTE },
    { label: 'Protected Page', to: PROTECTED_ROUTE },
    { label: 'Data Fetching', to: DATA_FETCHING_ROUTE },
    { label: 'Data Mutation', to: DATA_MUTATION_ROUTE },
    { label: 'Practice Page', to: PRACTICE_ROUTE },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <nav className="supports-backdrop-filter:bg-background/60 border-b border-border bg-background/95 shadow-sm backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="shrink-0">
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                Fluento
              </h1>
            </div>

            <ul className="hidden items-center gap-2 md:flex">
              {menuItems.map(({ label, to }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                      )
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              {isAuthenticated && (
                <li>
                  <SignOutButton />
                </li>
              )}
            </ul>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => {
                setIsMenuOpen((current) => !current);
              }}
            >
              {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>

          {isMenuOpen && (
            <div className="border-t border-border pb-4 md:hidden">
              <ul className="flex flex-col gap-2 pt-4">
                {menuItems.map(({ label, to }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className={({ isActive }) =>
                        cn(
                          'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                        )
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
                {isAuthenticated && (
                  <li className="pt-2">
                    <SignOutButton />
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl p-2 md:p-4 lg:p-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
