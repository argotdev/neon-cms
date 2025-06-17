import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to Neon CMS
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        A production-ready CMS with Neon Postgres and ParadeDB search
      </p>
      <div className="space-x-4">
        <Link
          href="/posts"
          className="btn btn-primary"
        >
          View Posts
        </Link>
        <Link
          href="/search"
          className="btn bg-gray-100 text-gray-900 hover:bg-gray-200"
        >
          Search
        </Link>
      </div>
    </div>
  );
} 