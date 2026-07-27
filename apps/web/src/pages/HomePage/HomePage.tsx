import './style.css';

import { useState } from 'react';

import heroImg from '../../assets/hero.png';
import reactLogo from '../../assets/react.svg';
import viteLogo from '../../assets/vite.svg';
import DataFetchingDemo from '../../components/DataFetchingDemo';
import DataMutationDemo from '../../components/DataMutationDemo';
import { useHttpClient } from '../../http';

export default function Home() {
  const httpClient = useHttpClient();
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await httpClient.get('/');
      setData(response.data as string);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch data from server',
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DataFetchingDemo />
      <DataMutationDemo />
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Welcome to Fluento</h1>
          <p>
            Get started by clicking the button below to fetch data from the server
          </p>
        </div>
        <button onClick={handleGetData} disabled={loading}>
          {loading ? 'Loading...' : 'Get data from server'}
        </button>
        {data && (
          <div className="data-display">
            <h2>Server Response:</h2>
            <p>{data}</p>
          </div>
        )}
        {error && (
          <div className="error-display">
            <h2>Error:</h2>
            <p>{error}</p>
          </div>
        )}
      </section>
    </>
  );
}
