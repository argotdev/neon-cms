-- Enable pg_search extension
CREATE EXTENSION IF NOT EXISTS pg_search;

-- Create posts table
CREATE TABLE "posts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "body" TEXT NOT NULL,
    "tags" TEXT[] NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create BM25 index
CREATE INDEX posts_search_idx ON posts USING bm25 (id, title, body, tags) WITH (key_field='id');

-- Set statement timeout
ALTER DATABASE current_database() SET statement_timeout = '3000';

-- Example RLS policy
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON posts
    FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON posts
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated'); 