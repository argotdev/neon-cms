'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { Post } from '@/lib/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: post, error, isLoading } = useSWR<Post>(
    `/api/posts/${params.id}`,
    fetcher
  );

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      router.push('/posts');
    } catch (err) {
      alert('Failed to delete post');
      setIsDeleting(false);
    }
  }

  if (isLoading) return <p>Loading post...</p>;
  if (error) return <p className="text-red-600">Error loading post</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <div className="flex gap-4">
          <Link
            href={`/posts/${post.id}/edit`}
            className="btn bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="prose max-w-none">
        <p>{post.body}</p>
      </div>
    </div>
  );
} 