'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { postSchema } from '@/lib/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { data: post, error: fetchError, isLoading } = useSWR(
    `/api/posts/${params.id}`,
    fetcher
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      body: formData.get('body'),
      tags: (formData.get('tags') as string).split(',').map((tag) => tag.trim()),
    };

    try {
      const validated = postSchema.parse(data);
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      router.push(`/posts/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  if (isLoading) return <p>Loading post...</p>;
  if (fetchError) return <p className="text-red-600">Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={post.title}
            required
            className="input"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-2">
            Slug
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            defaultValue={post.slug}
            required
            pattern="[a-z0-9-]+"
            className="input"
          />
          <p className="mt-1 text-sm text-gray-500">
            Use lowercase letters, numbers, and hyphens only
          </p>
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium mb-2">
            Content
          </label>
          <textarea
            id="body"
            name="body"
            defaultValue={post.body}
            required
            rows={10}
            className="input"
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            defaultValue={post.tags.join(', ')}
            required
            placeholder="tag1, tag2, tag3"
            className="input"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">
            Update Post
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
} 