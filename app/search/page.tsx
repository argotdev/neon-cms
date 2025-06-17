'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { SearchResult } from '@/lib/search';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch search results');
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const { data, error, isLoading } = useSWR<SearchResult[]>(
    query ? `/api/search?q=${encodeURIComponent(query)}` : null,
    fetcher
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Search Posts</h1>
      <div className="mb-8">
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts..."
          className="input"
        />
      </div>

      {isLoading && <p>Searching...</p>}
      {error && <p className="text-red-600">Error searching posts</p>}
      {data && (
        <div className="space-y-6">
          {data.length === 0 ? (
            <p>No results found</p>
          ) : (
            data.map((result) => (
              <article
                key={result.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">{result.title}</h2>
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: result.body }}
                />
                <div className="mt-2 text-sm text-gray-500">
                  Score: {result.score?.toFixed(2) ?? 'N/A'}
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
} 