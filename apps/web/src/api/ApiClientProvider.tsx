import { type AxiosInstance } from 'axios';

import { ApiClientContext } from './contexts';

export interface ApiClientProviderProps {
  children: React.ReactNode;
  apiClient: AxiosInstance;
}

export default function ApiClientProvider(props: ApiClientProviderProps) {
  const { apiClient: httpClient, children } = props;
  return (
    <ApiClientContext.Provider value={httpClient}>
      {children}
    </ApiClientContext.Provider>
  );
}
