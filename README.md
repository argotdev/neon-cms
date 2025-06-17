# Neon CMS with ParadeDB Search

A production-ready CMS built with Next.js 14, Neon Postgres, and ParadeDB's BM25 search.

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and update `DATABASE_URL`
3. Install dependencies: `npm install`
4. Push the database schema: `npm run db:push`
5. Seed the database: `npm run db:seed`
6. Start the development server: `npm run dev`

## Features

- Full-text search with BM25 ranking
- Serverless Postgres with Neon
- Type-safe API with Prisma + Zod
- Optimistic updates with SWR
- End-to-end tests with Playwright

## Development

- `npm run dev` - Start development server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run db:studio` - Open Prisma Studio 