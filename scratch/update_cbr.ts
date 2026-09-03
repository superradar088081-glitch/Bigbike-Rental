import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'CBR1000RR-R' } },
    data: {
      imageUrl: '/uploads/vehicles/honda_cbr1000rr_r_fireblade_sp.jpg',
      images: JSON.stringify(['/uploads/vehicles/honda_cbr1000rr_r_fireblade_sp.jpg']),
    },
  });
  console.log('✅ Updated Honda CBR1000RR-R Fireblade SP image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
