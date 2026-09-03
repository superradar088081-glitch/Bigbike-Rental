import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'Hayabusa' } },
    data: {
      imageUrl: '/uploads/vehicles/suzuki_hayabusa_gsx1300r.jpg',
      images: JSON.stringify(['/uploads/vehicles/suzuki_hayabusa_gsx1300r.jpg']),
    },
  });
  console.log('✅ Updated Suzuki Hayabusa GSX1300R image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
