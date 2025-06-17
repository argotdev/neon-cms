import { Pool } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import { PoolClient } from 'pg';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function withClient<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    return await callback(client);
  } finally {
    client.release();
  }
} 