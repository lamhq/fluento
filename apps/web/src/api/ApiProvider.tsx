import { ApiClientContext } from './contexts';
import type { ApiClient } from './types';

export interface ApiProviderProps {
  children: React.ReactNode;
  apiClient: ApiClient;
}

export default function ApiProvider(props: ApiProviderProps) {
  const { apiClient: httpClient, children } = props;
  return (
    <ApiClientContext.Provider value={httpClient}>
      {children}
    </ApiClientContext.Provider>
  );
}
