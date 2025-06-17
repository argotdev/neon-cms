import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchPosts } from './search';
import { withClient } from './db';

vi.mock('./db', () => ({
  withClient: vi.fn(),
}));

describe('searchPosts', () => {
  const mockClient = {
    query: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (withClient as any).mockImplementation((callback) => callback(mockClient));
  });

  it('should return BM25 search results', async () => {
    const mockResults = {
      rows: [
        {
          id: '1',
          title: 'Test Post',
          snippet: '...test...',
          score: 0.8,
        },
      ],
    };

    mockClient.query.mockResolvedValueOnce(mockResults);

    const results = await searchPosts('test');
    expect(results).toEqual(mockResults.rows);
    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'),
      ['test']
    );
  });

  it('should fall back to fuzzy search when no BM25 results', async () => {
    const mockFuzzyResults = {
      rows: [
        {
          id: '1',
          title: 'Test Post',
          snippet: '...test...',
          score: 0.5,
        },
      ],
    };

    mockClient.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce(mockFuzzyResults);

    const results = await searchPosts('test');
    expect(results).toEqual(mockFuzzyResults.rows);
    expect(mockClient.query).toHaveBeenCalledTimes(2);
  });
}); 