import { createContext } from 'react';

import type { ErrorConfig } from './types';

export const ErrorConfigContext = createContext<ErrorConfig | undefined>(undefined);
