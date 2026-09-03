import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'Fat Boy' } },
    data: {
      imageUrl: '/uploads/vehicles/harley_davidson_fat_boy_114.jpg',
      images: JSON.stringify(['/uploads/vehicles/harley_davidson_fat_boy_114.jpg']),
    },
  });
  console.log('✅ Updated Harley-Davidson Fat Boy 114 image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
