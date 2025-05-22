'use client';

import { useState } from 'react';
import { listDirectoryContents } from '../app/actions';

export default function DirectoryListing() {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchDirectoryContents = async () => {
    setIsLoading(true);
    setOutput(null);
    setError(null);

    try {
      // For simplicity, we'll list the project's root directory content from the server's perspective.
      // The `listDirectoryContents` action defaults to '.' (its own current working directory on the server).
      const result = await listDirectoryContents('.'); 
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.error) {
        setError(result.error);
      } else {
        setError('Received an unexpected response from the server.');
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Directory Listing</h2>
      <button onClick={handleFetchDirectoryContents} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'List Server Root Directory Contents'}
      </button>

      {isLoading && <p>Loading directory contents...</p>}

      {output && (
        <div>
          <h3>Output:</h3>
          <pre>{output}</pre>
        </div>
      )}

      {error && (
        <div>
          <h3>Error:</h3>
          <pre style={{ color: 'red' }}>{error}</pre>
        </div>
      )}
    </div>
  );
}
