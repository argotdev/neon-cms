import { withClient } from './db';

/** Row shape returned by all three search strategies */
export interface SearchResult {
  id: string;
  title: string;
  body: string;
  snippet: string;
  score: number;
}

export interface SearchOptions {
  /** Maximum rows to return. Default = 20 */
  limit?: number;
  /** Tag that wraps the first character of each hit. Default = <b> */
  startTag?: string;
  /** Closing tag for the hit wrapper. Default = </b> */
  endTag?: string;
  /** Levenshtein distance for fuzzy search. Default ≈ 20 % of query length (1‑3) */
  fuzzyDistance?: number;
}

/**
 * Full‑text search over the `posts` table.
 *   1. BM25 keyword search (title/body).
 *   2. Phrase search with small `slop`.
 *   3. Fallback to fuzzy match.
 *
 * Returns the first non‑empty result set.
 */
export async function searchPosts(
  query: string,
  options: SearchOptions = {},
): Promise<SearchResult[]> {
  const {
    limit = 20,
    startTag = '<b>',
    endTag = '</b>',
    fuzzyDistance = Math.min(3, Math.max(1, Math.floor(query.length * 0.2))),
  } = options;

  return withClient(async (client) => {
    /** 1 ▸ BM25 keyword search on title+body --------------------------- */
    const bm25 = await client.query<SearchResult>(
      `
      WITH bm25 AS (
        SELECT id,
               title,
               body,
               paradedb.snippet(body, start_tag => $2, end_tag => $3) AS snippet,
               paradedb.score(id)                    AS base_score,
               (title @@@ $1)::int                   AS hit_title,
               (body  @@@ $1)::int                   AS hit_body
        FROM   posts
        WHERE  title @@@ $1 OR body @@@ $1
      )
      SELECT id,
             title,
             body,
             snippet,
             base_score *
               CASE
                 WHEN hit_title = 1 AND hit_body = 1 THEN 2.5
                 WHEN hit_title = 1                    THEN 2.0
                 ELSE 1.0
               END                                   AS score
      FROM   bm25
      ORDER  BY score DESC
      LIMIT  $4;
      `,
      [query, startTag, endTag, limit],
    );
    if (bm25.rows.length) return bm25.rows;

    /** 2 ▸ Phrase search (words close together) ------------------------ */
    const words = query.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const slop = Math.min(2, words.length - 1);

      const phrase = await client.query<SearchResult>(
        `
        WITH phrase AS (
          SELECT id,
                 title,
                 body,
                 paradedb.snippet(body, start_tag => $3, end_tag => $4) AS snippet,
                 paradedb.score(id) AS base_score
          FROM   posts
          WHERE  id @@@ paradedb.phrase('title', $1::text[], slop => $2)
              OR id @@@ paradedb.phrase('body',  $1::text[], slop => $2)
        )
        SELECT id, title, body, snippet, base_score AS score
        FROM   phrase
        ORDER  BY score DESC
        LIMIT  $5;
        `,
        [words, slop, startTag, endTag, limit],
      );
      if (phrase.rows.length) return phrase.rows;
    }

    /** 3 ▸ Fuzzy match fallback --------------------------------------- */
    const fuzzy = await client.query<SearchResult>(
      `
      WITH fuzzy AS (
        SELECT id,
               title,
               body,
               paradedb.snippet(body, start_tag => $3, end_tag => $4) AS snippet,
               paradedb.score(id) AS base_score
        FROM   posts
        WHERE  id @@@ paradedb.match('title', $1, distance => $2)
            OR id @@@ paradedb.match('body',  $1, distance => $2)
      )
      SELECT id, title, body, snippet, base_score AS score
      FROM   fuzzy
      ORDER  BY score DESC
      LIMIT  $5;
      `,
      [query, fuzzyDistance, startTag, endTag, limit],
    );
    return fuzzy.rows; // may be empty
  });
}
