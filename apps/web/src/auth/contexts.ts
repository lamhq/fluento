import { createContext } from 'react';

import type { AuthConfig } from './types';

export const AuthConfigContext = createContext<AuthConfig | undefined>(undefined);
