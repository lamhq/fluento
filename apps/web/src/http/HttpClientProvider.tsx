import axios from 'axios';
import { useMemo } from 'react';

import { HttpClientContext } from './contexts';

export interface HttpClientProviderProps {
  children: React.ReactNode;
  baseUrl: string;
}

export default function HttpClientProvider(props: HttpClientProviderProps) {
  const { baseUrl, children } = props;

  const httpClient = useMemo(
    () =>
      axios.create({
        baseURL: baseUrl,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    [baseUrl],
  );

  return (
    <HttpClientContext.Provider value={httpClient}>
      {children}
    </HttpClientContext.Provider>
  );
}
