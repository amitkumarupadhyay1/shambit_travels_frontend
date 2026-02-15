'use client';

import { useState } from 'react';
import { useUniversalSearch } from '@/hooks/useUniversalSearch';

export default function AutocompleteTestPage() {
  const [query, setQuery] = useState('');
  
  const { results, loading, error } = useUniversalSearch({
    initialQuery: query,
    autoSearch: true,
    debounceMs: 300,
    options: { limit: 5 },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Autocomplete Debug Test</h1>

        {/* Simple Input */}
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
          />
        </div>

        {/* Debug Info */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <div className="space-y-1 text-sm">
            <p><strong>Query:</strong> &quot;{query}&quot; (length: {query.length})</p>
            <p><strong>Loading:</strong> {loading ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Error:</strong> {error || '✅ None'}</p>
            <p><strong>Results:</strong> {results ? `✅ ${results.total_count} found` : '❌ None'}</p>
            {results && (
              <>
                <p><strong>Packages:</strong> {results.results.packages.length}</p>
                <p><strong>Cities:</strong> {results.results.cities.length}</p>
                <p><strong>Articles:</strong> {results.results.articles.length}</p>
                <p><strong>Experiences:</strong> {results.results.experiences.length}</p>
              </>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">🔄 Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ Error: {error}</p>
          </div>
        )}

        {/* Results */}
        {results && results.total_count > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h2 className="font-semibold mb-3">✅ Results Found:</h2>
            
            {results.results.packages.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium text-sm text-gray-700 mb-1">Packages:</h3>
                <ul className="list-disc list-inside text-sm">
                  {results.results.packages.map((pkg) => (
                    <li key={pkg.id}>{pkg.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.results.cities.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium text-sm text-gray-700 mb-1">Cities:</h3>
                <ul className="list-disc list-inside text-sm">
                  {results.results.cities.map((city) => (
                    <li key={city.id}>{city.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.results.articles.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium text-sm text-gray-700 mb-1">Articles:</h3>
                <ul className="list-disc list-inside text-sm">
                  {results.results.articles.map((article) => (
                    <li key={article.id}>{article.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.results.experiences.length > 0 && (
              <div className="mb-3">
                <h3 className="font-medium text-sm text-gray-700 mb-1">Experiences:</h3>
                <ul className="list-disc list-inside text-sm">
                  {results.results.experiences.map((exp) => (
                    <li key={exp.id}>{exp.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {results && results.total_count === 0 && query.length >= 2 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">No results found for &quot;{query}&quot;</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Test Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser console (F12)</li>
            <li>Type &quot;mumbai&quot; in the search box</li>
            <li>Wait 300ms for debounce</li>
            <li>Check if results appear below</li>
            <li>Check console for API logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
