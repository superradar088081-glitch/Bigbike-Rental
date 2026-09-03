import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'Speed Triple' } },
    data: {
      imageUrl: '/uploads/vehicles/triumph_speed_triple_1200_rs.jpg',
      images: JSON.stringify(['/uploads/vehicles/triumph_speed_triple_1200_rs.jpg']),
    },
  });
  console.log('✅ Updated Triumph Speed Triple 1200 RS image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
