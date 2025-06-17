'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { Post } from '@/lib/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostsPage() {
  const { data: posts, error, isLoading } = useSWR<Post[]>('/api/posts', fetcher);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">
          New Post
        </Link>
      </div>

      {isLoading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">Error loading posts</p>}
      {posts && (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p>No posts yet</p>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="flex gap-2 mb-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 line-clamp-2">{post.body}</p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
} 