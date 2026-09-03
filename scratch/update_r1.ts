import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'YZF-R1' } },
    data: {
      imageUrl: '/uploads/vehicles/yamaha_yzf_r1.jpg',
      images: JSON.stringify(['/uploads/vehicles/yamaha_yzf_r1.jpg']),
    },
  });
  console.log('✅ Updated Yamaha YZF-R1 image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
