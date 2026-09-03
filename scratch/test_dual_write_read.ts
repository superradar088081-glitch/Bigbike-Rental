import { prisma, mysqlClient, neonClient } from '../src/lib/db/prisma';

async function test() {
  console.log('--- Testing Dual DB Read ---');
  const vehicles = await prisma.vehicle.findMany({ take: 3 });
  console.log(`Read ${vehicles.length} vehicles via dualPrisma proxy`);

  console.log('--- Testing MySQL direct count ---');
  const mysqlCount = await mysqlClient.vehicle.count();
  console.log(`MySQL vehicle count: ${mysqlCount}`);

  console.log('--- Testing Neon direct count ---');
  const neonCount = await neonClient.vehicle.count();
  console.log(`Neon vehicle count: ${neonCount}`);

  console.log('--- Testing Dual Write (Create Test Vehicle) ---');
  const testPlate = `TEST-${Date.now().toString().slice(-4)}`;
  const created = await prisma.vehicle.create({
    data: {
      brand: 'Ducati',
      model: 'Dual DB Test Bike',
      year: 2024,
      engineCC: 1100,
      licensePlate: testPlate,
      color: 'Red',
      category: 'Super Sport',
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      rentalPricePerDay: 5000,
      depositAmount: 30000,
    },
  });
  console.log('Created vehicle with plate:', created.licensePlate);

  // Check if it exists in BOTH MySQL and Neon
  const inMysql = await mysqlClient.vehicle.findUnique({ where: { licensePlate: testPlate } });
  const inNeon = await neonClient.vehicle.findUnique({ where: { licensePlate: testPlate } });
  console.log('Present in MySQL:', Boolean(inMysql));
  console.log('Present in Neon:', Boolean(inNeon));

  // Clean up test vehicle from both
  await prisma.vehicle.delete({ where: { licensePlate: testPlate } });
  console.log('Cleaned up test vehicle from both databases!');
}

test()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
