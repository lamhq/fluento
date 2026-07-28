import type { AxiosInstance } from 'axios';
import { createContext } from 'react';

export const ApiClientContext = createContext<AxiosInstance | null>(null);
