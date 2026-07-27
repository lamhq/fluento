import { type AxiosInstance } from 'axios';

import { HttpClientContext } from './contexts';

export interface HttpClientProviderProps {
  children: React.ReactNode;
  httpClient: AxiosInstance;
}

export default function HttpClientProvider(props: HttpClientProviderProps) {
  const { httpClient, children } = props;
  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
}
