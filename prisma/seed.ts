import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const posts = [
    {
      title: 'Getting Started with Neon Postgres',
      slug: 'getting-started-neon-postgres',
      body: 'Learn how to use Neon Postgres with your Next.js application...',
      tags: ['postgres', 'neon', 'nextjs'],
    },
    {
      title: 'Building Full-Text Search with ParadeDB',
      slug: 'building-full-text-search-paradedb',
      body: 'Implement BM25 search in your application using ParadeDB...',
      tags: ['search', 'paradedb', 'postgres'],
    },
    {
      title: 'Serverless Database Best Practices',
      slug: 'serverless-database-best-practices',
      body: 'Tips and tricks for working with serverless databases...',
      tags: ['serverless', 'database', 'best-practices'],
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 