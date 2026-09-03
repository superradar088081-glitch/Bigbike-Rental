import { prisma } from '../src/lib/db/prisma';
import { neonPrisma } from '../src/lib/db/neon';
import { DbSyncService } from '../src/services/db-sync.service';

async function main() {
  console.log('Testing dual database connection...');
  const results = await DbSyncService.testConnections();
  console.log('Test Results:', JSON.stringify(results, null, 2));

  if (results.mysql.ok && results.neon.ok) {
    console.log('Both databases connected! Testing sync MySQL -> Neon...');
    const syncRes = await DbSyncService.syncMysqlToNeon();
    console.log('Sync Results:', syncRes);
  } else {
    console.log('Status:');
    console.log('MySQL (phpMyAdmin):', results.mysql);
    console.log('Neon (PostgreSQL):', results.neon);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await neonPrisma.$disconnect();
  });
