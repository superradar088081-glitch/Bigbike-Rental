import { PrismaClient, VehicleStatus, GpsDeviceStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.vehicle.findUnique({
    where: { licensePlate: '9กท 1340' },
  });

  let bike = existing;

  if (!existing) {
    bike = await prisma.vehicle.create({
      data: {
        brand: 'Suzuki',
        model: 'Hayabusa GSX1300R',
        year: 2024,
        engineCC: 1340,
        licensePlate: '9กท 1340',
        color: 'Glass Sparkle Black / Candy Burnt Gold',
        category: 'Hyper Sport',
        horsepower: 190,
        fuelType: 'Gasoline 95',
        transmission: 'Manual 6-Speed with Quickshifter',
        seatHeight: 800,
        weightKg: 264,
        description: 'พญาเหยี่ยวในตำนาน Suzuki Hayabusa เจนเนอเรชันที่ 3 เครื่องยนต์ 1,340 ซีซี ทรงพลัง นุ่มนวล ควบคุมง่ายด้วยระบบอิเล็กทรอนิกส์ S.I.R.S. ครบครัน รองรับการเดินทางไกลและความเร็วสูงอย่างมั่นใจ',
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80'
        ]),
        rentalPricePerDay: 7900,
        depositAmount: 45000,
        status: VehicleStatus.AVAILABLE,
        mileage: 2800,
      },
    });
  }

  if (bike) {
    const existingGps = await prisma.gpsDevice.findUnique({
      where: { vehicleId: bike.id },
    });

    if (!existingGps) {
      const gps = await prisma.gpsDevice.create({
        data: {
          vehicleId: bike.id,
          deviceSerial: 'GPS-SZ-1340',
          batteryLevel: 98,
          status: GpsDeviceStatus.ACTIVE,
          lastSeenAt: new Date(),
        },
      });

      await prisma.gpsLog.create({
        data: {
          deviceId: gps.id,
          latitude: 13.7563,
          longitude: 100.5018,
          speed: 0,
          heading: 90,
          isOutOfZone: false,
        },
      });
    }
    console.log('✅ Successfully added Suzuki Hayabusa! Model:', bike.model, 'Plate:', bike.licensePlate);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
