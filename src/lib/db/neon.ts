import { PrismaClient as NeonPrismaClient } from '@prisma/client-neon';

const globalForNeonPrisma = globalThis as unknown as {
  neonPrisma: NeonPrismaClient | undefined;
};

export const neonPrisma =
  globalForNeonPrisma.neonPrisma ??
  new NeonPrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForNeonPrisma.neonPrisma = neonPrisma;
}
