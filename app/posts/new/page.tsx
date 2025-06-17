'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { postSchema } from '@/lib/schema';

export default function NewPostPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

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
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      router.push(`/posts/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">New Post</h1>
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
            required
            placeholder="tag1, tag2, tag3"
            className="input"
          />
        </div>
        <div className="flex gap-4">
          <button type="submit" className="btn btn-primary">
            Create Post
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