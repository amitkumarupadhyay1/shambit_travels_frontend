'use client';

import { useState } from 'react';
import { apiService } from '@/lib/api';
import type { SearchResponse, SearchStats } from '@/types/search';

export default function ApiTestPage() {
  const [query, setQuery] = useState('tour');
  const [response, setResponse] = useState<SearchResponse | SearchStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testSearch = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('🔍 Testing search with query:', query);
      const result = await apiService.universalSearch(query);
      console.log('✅ Search result:', result);
      setResponse(result);
    } catch (err) {
      console.error('❌ Search error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testStats = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('📊 Testing stats endpoint');
      const result = await apiService.getSearchStats();
      console.log('✅ Stats result:', result);
      setResponse(result);
    } catch (err) {
      console.error('❌ Stats error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          API Direct Test
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Search API</h2>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter search query"
            />
            <button
              onClick={testSearch}
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Search'}
            </button>
            <button
              onClick={testStats}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Stats'}
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 font-semibold">Error:</p>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {response && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">Response:</p>
              <pre className="text-xs overflow-auto max-h-96 bg-white p-4 rounded border">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Open browser console (F12)</li>
            <li>Click &quot;Test Search&quot; to test the search API</li>
            <li>Click &quot;Test Stats&quot; to test the stats API</li>
            <li>Check console for detailed logs</li>
            <li>Check Network tab for API requests</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
