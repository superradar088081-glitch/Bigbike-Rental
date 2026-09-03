import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'Streetfighter' } },
    data: {
      imageUrl: '/uploads/vehicles/ducati_streetfighter_v4.jpg',
      images: JSON.stringify(['/uploads/vehicles/ducati_streetfighter_v4.jpg']),
    },
  });
  console.log('✅ Updated Ducati Streetfighter V4 image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
