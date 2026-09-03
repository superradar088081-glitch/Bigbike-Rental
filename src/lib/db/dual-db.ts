import { PrismaClient as MySqlPrismaClient } from '@prisma/client';
import { PrismaClient as NeonPrismaClient } from '@prisma/client-neon';

// Global singleton caching for Next.js hot reload
const globalForDualDb = globalThis as unknown as {
  mysqlClient?: MySqlPrismaClient;
  neonClient?: NeonPrismaClient;
};

// 1. MySQL (phpMyAdmin) Client Instance
export const mysqlClient =
  globalForDualDb.mysqlClient ??
  new MySqlPrismaClient({
    datasources: process.env.DATABASE_URL?.startsWith('mysql')
      ? { db: { url: process.env.DATABASE_URL } }
      : undefined,
    log: ['error'],
  });

// 2. Neon (PostgreSQL) Client Instance
export const neonClient =
  globalForDualDb.neonClient ??
  new NeonPrismaClient({
    datasources: process.env.NEON_DATABASE_URL
      ? { db: { url: process.env.NEON_DATABASE_URL } }
      : undefined,
    log: ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDualDb.mysqlClient = mysqlClient;
  globalForDualDb.neonClient = neonClient;
}

// Write operation method names that modify data
const WRITE_OPERATIONS = new Set([
  'create',
  'createMany',
  'update',
  'updateMany',
  'upsert',
  'delete',
  'deleteMany',
]);

/**
 * Creates a smart dual-database proxy for a given model delegate.
 * - Reads: Tries primary DB, automatically falls back to secondary DB if primary fails or is empty.
 * - Writes: Simultaneously writes to BOTH MySQL (phpMyAdmin) and Neon (PostgreSQL).
 */
function createModelProxy(modelName: string) {
  return new Proxy(
    {},
    {
      get(_target, prop: string) {
        const isWrite = WRITE_OPERATIONS.has(prop);

        return async (...args: any[]) => {
          const isVercel = Boolean(process.env.VERCEL) || process.env.DATABASE_URL?.startsWith('postgres');
          const primaryClient = isVercel ? neonClient : mysqlClient;
          const secondaryClient = isVercel ? mysqlClient : neonClient;

          // === DUAL WRITE: Write to BOTH databases concurrently ===
          if (isWrite) {
            const primaryPromise = (primaryClient as any)[modelName]?.[prop]?.(...args);
            const secondaryPromise = (secondaryClient as any)[modelName]?.[prop]?.(...args);

            const [primaryRes, secondaryRes] = await Promise.allSettled([
              primaryPromise,
              secondaryPromise,
            ]);

            if (primaryRes.status === 'fulfilled') {
              return primaryRes.value;
            } else if (secondaryRes.status === 'fulfilled') {
              console.warn(`[DualDB] Primary DB write failed on ${modelName}.${prop}, but Secondary DB succeeded.`);
              return secondaryRes.value;
            } else {
              console.error(`[DualDB] Both databases failed to write on ${modelName}.${prop}:`, primaryRes.reason);
              throw primaryRes.reason || secondaryRes.reason;
            }
          }

          // === DUAL READ: Read with auto-failover & fallback ===
          try {
            const result = await (primaryClient as any)[modelName]?.[prop]?.(...args);
            // If primary returned null or empty array, check if secondary has data
            if ((result === null || (Array.isArray(result) && result.length === 0)) && prop.startsWith('find')) {
              try {
                const secResult = await (secondaryClient as any)[modelName]?.[prop]?.(...args);
                if (secResult !== null && (!Array.isArray(secResult) || secResult.length > 0)) {
                  return secResult;
                }
              } catch {
                // Ignore secondary read error if primary succeeded with empty/null
              }
            }
            return result;
          } catch (primaryErr: any) {
            console.warn(`[DualDB] Primary DB read failed on ${modelName}.${prop} (${primaryErr?.message}), trying Secondary DB...`);
            try {
              return await (secondaryClient as any)[modelName]?.[prop]?.(...args);
            } catch (secErr: any) {
              console.error(`[DualDB] Both databases failed to read on ${modelName}.${prop}:`, secErr);
              throw primaryErr;
            }
          }
        };
      },
    }
  );
}

// Proxied models cache
const modelProxies: Record<string, any> = {};

/**
 * Unified Dual Database Client Proxy
 * Accessible as standard `prisma` everywhere.
 */
export const dualPrisma: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      if (prop === '$transaction') {
        return async (arg: any, options?: any) => {
          const isVercel = Boolean(process.env.VERCEL) || process.env.DATABASE_URL?.startsWith('postgres');
          const client = isVercel ? neonClient : mysqlClient;
          try {
            return await (client as any).$transaction(arg, options);
          } catch (err) {
            const fallback = isVercel ? mysqlClient : neonClient;
            return await (fallback as any).$transaction(arg, options);
          }
        };
      }

      if (prop === '$disconnect') {
        return async () => {
          await Promise.allSettled([mysqlClient.$disconnect(), neonClient.$disconnect()]);
        };
      }

      if (prop === '$connect') {
        return async () => {
          await Promise.allSettled([mysqlClient.$connect(), neonClient.$connect()]);
        };
      }

      if (!modelProxies[prop]) {
        modelProxies[prop] = createModelProxy(prop);
      }
      return modelProxies[prop];
    },
  }
);
