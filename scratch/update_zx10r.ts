import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.vehicle.updateMany({
    where: { model: { contains: 'ZX-10R' } },
    data: {
      imageUrl: '/uploads/vehicles/kawasaki_ninja_zx10r.jpg',
      images: JSON.stringify(['/uploads/vehicles/kawasaki_ninja_zx10r.jpg']),
    },
  });
  console.log('✅ Updated Kawasaki Ninja ZX-10R image in MySQL database successfully!');
}

run()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
