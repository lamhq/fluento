import { Suspense } from 'react';

import { useServerData } from '../../hooks';

function FetchData() {
  const data = useServerData();
  return (
    <>
      <p>Data from server:</p>
      {data}
    </>
  );
}

export default function DataFetchingPage() {
  return (
    <>
      <h3>Data Fetching Demo</h3>

      <Suspense fallback="Fetching ...">
        <FetchData />
      </Suspense>
    </>
  );
}
