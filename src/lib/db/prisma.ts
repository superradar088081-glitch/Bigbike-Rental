import { PrismaClient as MySqlPrismaClient } from '@prisma/client';
import { PrismaClient as NeonPrismaClient } from '@prisma/client-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

// Determine whether to use Neon PostgreSQL (Vercel / Cloud / Postgres URL) or Local MySQL
const isUsingNeon =
  Boolean(process.env.VERCEL) ||
  process.env.USE_NEON === 'true' ||
  process.env.DATABASE_URL?.startsWith('postgres') ||
  process.env.DATABASE_URL?.includes('neon.tech') ||
  (Boolean(process.env.NEON_DATABASE_URL) && (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')));

export const prisma: any =
  globalForPrisma.prisma ??
  (isUsingNeon
    ? new NeonPrismaClient({
        datasources: process.env.NEON_DATABASE_URL
          ? { db: { url: process.env.NEON_DATABASE_URL } }
          : undefined,
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      })
    : new MySqlPrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      }));

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

