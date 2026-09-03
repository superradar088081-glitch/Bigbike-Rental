import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'Panigale' } },
    data: {
      imageUrl: '/uploads/vehicles/ducati_panigale_v4s.jpg',
      images: JSON.stringify(['/uploads/vehicles/ducati_panigale_v4s.jpg']),
    },
  });
  console.log('✅ Updated Ducati Panigale V4S image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
