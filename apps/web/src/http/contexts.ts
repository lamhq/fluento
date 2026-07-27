import type { AxiosInstance } from 'axios';
import { createContext } from 'react';

export const HttpClientContext = createContext<AxiosInstance | null>(null);
