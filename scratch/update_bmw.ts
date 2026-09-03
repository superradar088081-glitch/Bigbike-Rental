import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'S 1000' } },
    data: {
      imageUrl: '/uploads/vehicles/bmw_s1000rr.jpg',
      images: JSON.stringify(['/uploads/vehicles/bmw_s1000rr.jpg']),
    },
  });
  console.log('✅ Updated BMW S 1000 RR image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
