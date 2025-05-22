'use client'

import { useState } from 'react'
import { listDirectoryContents } from '../app/actions'

export default function DirectoryListing() {
  const [output, setOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [directory, setDirectory] = useState<string>('.')

  const handleFetchDirectoryContents = async () => {
    setIsLoading(true)
    setOutput(null)
    setError(null)

    try {
      // Use the user-specified directory or default to '.'
      const result = await listDirectoryContents(directory)
      if (result.stdout) {
        setOutput(result.stdout)
      } else if (result.error) {
        setError(result.error)
      } else {
        setError('Received an unexpected response from the server.')
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Directory Listing
      </h2>

      <div className="mb-4">
        <label
          htmlFor="directory-input"
          className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
        >
          Directory Path
        </label>
        <div className="flex gap-2">
          <input
            id="directory-input"
            type="text"
            value={directory}
            onChange={(e) => setDirectory(e.target.value)}
            placeholder="Enter directory path (e.g., ., .., /etc)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:border-blue-300 dark:focus:border-blue-600 dark:bg-gray-800"
          />
          <button
            onClick={handleFetchDirectoryContents}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? 'Loading...' : 'List Directory'}
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading directory contents...
        </p>
      )}

      {output && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Output:</h3>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            {output}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Error:</h3>
          <pre className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-400 overflow-x-auto">
            {error}
          </pre>
        </div>
      )}
    </div>
  )
}
