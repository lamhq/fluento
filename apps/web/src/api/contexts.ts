import { createContext } from 'react';

import type { ApiClient } from './types';

export const ApiClientContext = createContext<ApiClient | null>(null);
