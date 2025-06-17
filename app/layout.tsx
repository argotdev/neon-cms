import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Neon CMS',
  description: 'A production-ready CMS with Neon Postgres and ParadeDB search',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <a href="/" className="flex items-center">
                  <span className="text-xl font-bold text-primary-600">
                    Neon CMS
                  </span>
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/posts" className="text-gray-600 hover:text-gray-900">
                  Posts
                </a>
                <a href="/search" className="text-gray-600 hover:text-gray-900">
                  Search
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
} 