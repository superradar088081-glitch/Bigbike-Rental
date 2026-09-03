import { PrismaClient, Role, VehicleStatus, BookingStatus, PaymentStatus, PaymentType, PaymentMethod, DocumentType, DocumentStatus, DamageReportStatus, MaintenanceStatus, PointsTransactionType, GpsDeviceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Big Bike Rental database seed...');

  // 1. Clean existing records in correct relation order
  await prisma.pointsTransaction.deleteMany();
  await prisma.damageReport.deleteMany();
  await prisma.maintenanceLog.deleteMany();
  await prisma.gpsLog.deleteMany();
  await prisma.gpsDevice.deleteMany();
  await prisma.rentalContract.deleteMany();
  await prisma.rentalDocument.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.membershipTier.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 2. Create Membership Tiers
  const bronzeTier = await prisma.membershipTier.create({
    data: {
      name: 'BRONZE',
      minPoints: 0,
      discountPercentage: 0,
      multiplier: 1.0,
      color: '#94a3b8',
      perks: 'Standard rental rates, 1x points multiplier, 24/7 roadside assistance',
    },
  });

  const silverTier = await prisma.membershipTier.create({
    data: {
      name: 'SILVER',
      minPoints: 500,
      discountPercentage: 5,
      multiplier: 1.2,
      color: '#38bdf8',
      perks: '5% discount on all rentals, 1.2x points multiplier, free helmet & jacket',
    },
  });

  const goldTier = await prisma.membershipTier.create({
    data: {
      name: 'GOLD',
      minPoints: 1500,
      discountPercentage: 10,
      multiplier: 1.5,
      color: '#eab308',
      perks: '10% discount, 1.5x points multiplier, priority booking, free action camera rental',
    },
  });

  const platinumTier = await prisma.membershipTier.create({
    data: {
      name: 'PLATINUM',
      minPoints: 3000,
      discountPercentage: 15,
      multiplier: 2.0,
      color: '#e11d48',
      perks: '15% discount, 2x points multiplier, zero deposit option, VIP concierge & track day invites',
    },
  });

  console.log('🎖️ Created Membership Tiers.');

  // 3. Create Admin & Staff Users
  const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);
  const staffPasswordHash = await bcrypt.hash('Staff@1234', 10);
  const customerPasswordHash = await bcrypt.hash('Customer@1234', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      name: 'Admin BigBike',
      role: Role.ADMIN,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    },
  });

  const staffUser = await prisma.user.create({
    data: {
      email: 'staff@example.com',
      passwordHash: staffPasswordHash,
      name: 'Staff Somchai',
      role: Role.STAFF,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    },
  });

  // 4. Create Customers
  const customerUser1 = await prisma.user.create({
    data: {
      email: 'somchai@example.com',
      passwordHash: customerPasswordHash,
      name: 'สมชาย สุขประเสริฐ',
      role: Role.CUSTOMER,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      userId: customerUser1.id,
      firstName: 'สมชาย',
      lastName: 'สุขประเสริฐ',
      phone: '081-234-5678',
      address: '123/45 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      idCardNumber: '1100400123456',
      driverLicenseNumber: 'DL-66012948',
      points: 1850,
      membershipTierId: goldTier.id,
    },
  });

  const customerUser2 = await prisma.user.create({
    data: {
      email: 'somsri@example.com',
      passwordHash: customerPasswordHash,
      name: 'สมศรี วงศ์วิวัฒน์',
      role: Role.CUSTOMER,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: customerUser2.id,
      firstName: 'สมศรี',
      lastName: 'วงศ์วิวัฒน์',
      phone: '089-876-5432',
      address: '88/9 ถนนพหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ 10900',
      idCardNumber: '1100500987654',
      driverLicenseNumber: 'DL-65098231',
      points: 620,
      membershipTierId: silverTier.id,
    },
  });

  const customerUser3 = await prisma.user.create({
    data: {
      email: 'john.miller@example.com',
      passwordHash: customerPasswordHash,
      name: 'John Miller',
      role: Role.CUSTOMER,
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      userId: customerUser3.id,
      firstName: 'John',
      lastName: 'Miller',
      phone: '095-112-3344',
      address: '15/2 Silom Rd, Bang Rak, Bangkok 10500',
      idCardNumber: 'PP-M9847219',
      driverLicenseNumber: 'INT-DL-883920',
      points: 3400,
      membershipTierId: platinumTier.id,
    },
  });

  const demoCustomerUser = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      passwordHash: customerPasswordHash,
      name: 'Demo Rider',
      role: Role.CUSTOMER,
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    },
  });

  const demoCustomer = await prisma.customer.create({
    data: {
      userId: demoCustomerUser.id,
      firstName: 'เดโม',
      lastName: 'ไรเดอร์',
      phone: '086-999-8877',
      address: '99/1 ถนนพระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
      idCardNumber: '1100700889900',
      driverLicenseNumber: 'DL-66112233',
      points: 800,
      membershipTierId: silverTier.id,
    },
  });

  console.log('👤 Created Users and Customers.');

  // 5. Create Big Bike Fleet
  const vehiclesData = [
    {
      brand: 'Ducati',
      model: 'Panigale V4S',
      year: 2023,
      engineCC: 1103,
      licensePlate: '1กพ 1234',
      color: 'Ducati Red',
      category: 'Super Sport',
      horsepower: 214,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed (Quickshifter)',
      seatHeight: 835,
      weightKg: 195,
      description: 'เรือธงสายสปอร์ตระดับท็อปจาก Ducati มาพร้อมเครื่องยนต์ Desmosedici Stradale V4 1,103cc และช่วงล่างไฟฟ้า Öhlins Smart EC 2.0',
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 8500,
      depositAmount: 50000,
      status: VehicleStatus.AVAILABLE,
      mileage: 12500,
    },
    {
      brand: 'BMW',
      model: 'S 1000 RR',
      year: 2024,
      engineCC: 999,
      licensePlate: '2ขจ 5678',
      color: 'Motorsport Light White',
      category: 'Super Sport',
      horsepower: 207,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed (Shift Assistant Pro)',
      seatHeight: 824,
      weightKg: 197,
      description: 'สุดยอด Superbike สัญชาติเยอรมัน เทคโนโลยี ShiftCam ให้พละกำลังต่อเนื่องทุกย่านความเร็ว ปีกวิงเล็ตคาร์บอนเพิ่มแรงกดสูงสุด',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 7500,
      depositAmount: 45000,
      status: VehicleStatus.RENTED,
      mileage: 8200,
    },
    {
      brand: 'Yamaha',
      model: 'YZF-R1',
      year: 2023,
      engineCC: 998,
      licensePlate: '3คภ 9012',
      color: 'Icon Blue',
      category: 'Super Sport',
      horsepower: 200,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed',
      seatHeight: 855,
      weightKg: 201,
      description: 'เครื่องยนต์ Crossplane CP4 เอกลักษณ์เสียงคำรามดุดันและการควบคุมที่คล่องตัวระดับ MotoGP แชมเปี้ยน',
      imageUrl: 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 6500,
      depositAmount: 40000,
      status: VehicleStatus.AVAILABLE,
      mileage: 14300,
    },
    {
      brand: 'Kawasaki',
      model: 'Ninja ZX-10R',
      year: 2023,
      engineCC: 998,
      licensePlate: '4งต 3456',
      color: 'Lime Green / Ebony',
      category: 'Super Sport',
      horsepower: 203,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed (KQS)',
      seatHeight: 835,
      weightKg: 207,
      description: 'สายเลือดแชมป์ WorldSBK 6 สมัยติดต่อกัน แชสซีส์ที่เสถียร ระบบระบายความร้อนด้วยออยล์คูลเลอร์แยกอิสระ',
      imageUrl: 'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 6000,
      depositAmount: 35000,
      status: VehicleStatus.AVAILABLE,
      mileage: 11000,
    },
    {
      brand: 'Ducati',
      model: 'Streetfighter V4',
      year: 2023,
      engineCC: 1103,
      licensePlate: '5จท 7890',
      color: 'Ducati Red',
      category: 'Hyper Naked',
      horsepower: 208,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed',
      seatHeight: 845,
      weightKg: 199,
      description: 'The Fight Formula: หัวใจ Panigale V4 ถอดแฟริ่ง แฮนด์บาร์กว้าง พร้อมปีกสองชั้น Biplane wings ให้แรงกด 28 กก. ที่ 270 กม./ชม.',
      imageUrl: 'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1615172282427-9a57ef2d142e?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 8000,
      depositAmount: 45000,
      status: VehicleStatus.RESERVED,
      mileage: 9400,
    },
    {
      brand: 'Honda',
      model: 'CBR1000RR-R Fireblade SP',
      year: 2023,
      engineCC: 999,
      licensePlate: '6ฉน 1122',
      color: 'Grand Prix Red',
      category: 'Super Sport',
      horsepower: 217,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed',
      seatHeight: 830,
      weightKg: 201,
      description: 'Born to Race! พัฒนาโดย HRC ด้วยเทคโนโลยีจาก RC213V เครื่องยนต์รอบจัด 217 แรงม้า ช่วงล่าง Öhlins Semi-Active',
      imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 7800,
      depositAmount: 45000,
      status: VehicleStatus.AVAILABLE,
      mileage: 6700,
    },
    {
      brand: 'Triumph',
      model: 'Speed Triple 1200 RS',
      year: 2023,
      engineCC: 1160,
      licensePlate: '7ชบ 4455',
      color: 'Matt Silver Ice',
      category: 'Naked Roadster',
      horsepower: 180,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed',
      seatHeight: 830,
      weightKg: 198,
      description: 'เครื่องยนต์ 3 สูบ 1,160cc น้ำหนักเบา คล่องตัว ทรงพลัง เบรก Brembo Stylema และระบบเบรก ABS ในโค้ง Cornering ABS',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 5800,
      depositAmount: 35000,
      status: VehicleStatus.MAINTENANCE,
      mileage: 10100,
    },
    {
      brand: 'Suzuki',
      model: 'Hayabusa GSX1300R',
      year: 2024,
      engineCC: 1340,
      licensePlate: '9กท 1340',
      color: 'Glass Sparkle Black / Candy Burnt Gold',
      category: 'Hyper Sport',
      horsepower: 190,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed (Quickshifter)',
      seatHeight: 800,
      weightKg: 264,
      description: 'พญาเหยี่ยวในตำนาน Suzuki Hayabusa เจนเนอเรชันที่ 3 เครื่องยนต์ 1,340 ซีซี ทรงพลัง นุ่มนวล ควบคุมง่ายด้วยระบบอิเล็กทรอนิกส์ S.I.R.S. ครบครัน รองรับการเดินทางไกลและความเร็วสูงอย่างมั่นใจ',
      imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 7900,
      depositAmount: 45000,
      status: VehicleStatus.AVAILABLE,
      mileage: 2800,
    },
    {
      brand: 'Harley-Davidson',
      model: 'Fat Boy 114',
      year: 2023,
      engineCC: 1868,
      licensePlate: '8ซล 7788',
      color: 'Vivid Black',
      category: 'Cruiser',
      horsepower: 94,
      fuelType: 'Gasoline 95',
      transmission: 'Manual 6-Speed',
      seatHeight: 675,
      weightKg: 317,
      description: 'ไอคอนแห่งความเท่สไตล์ American Cruiser เครื่องยนต์ Milwaukee-Eight 114cc แรงบิดมหาศาล ล้อแม็กตัน Lakester ขนาด 240 มม.',
      imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      images: [
        'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      ],
      rentalPricePerDay: 6800,
      depositAmount: 40000,
      status: VehicleStatus.AVAILABLE,
      mileage: 15200,
    },
  ];

  const createdVehicles = [];
  for (const vData of vehiclesData) {
    const v = await prisma.vehicle.create({
      data: {
        ...vData,
        images: Array.isArray(vData.images) ? JSON.stringify(vData.images) : vData.images,
      },
    });
    createdVehicles.push(v);
  }

  console.log(`🏍️ Created ${createdVehicles.length} Big Bikes.`);

  // 6. Create GPS Devices & Live Logs for Vehicles
  const gpsLocations = [
    { lat: 13.7462, lng: 100.5348, speed: 65, isOut: false }, // Siam / Pathum Wan
    { lat: 13.7279, lng: 100.5241, speed: 80, isOut: false }, // Silom / Sathon
    { lat: 13.7367, lng: 100.5604, speed: 45, isOut: false }, // Asok / Sukhumvit
    { lat: 13.8035, lng: 100.5538, speed: 95, isOut: false }, // Chatuchak
    { lat: 14.1523, lng: 100.6120, speed: 120, isOut: true }, // Out of zone (Ayutthaya boundary)
    { lat: 13.6900, lng: 100.7501, speed: 110, isOut: false }, // Bang Na / Suvarnabhumi
    { lat: 13.7563, lng: 100.5018, speed: 0, isOut: false },  // Old Town
    { lat: 13.7800, lng: 100.5800, speed: 50, isOut: false }, // Huai Khwang
  ];

  for (let i = 0; i < createdVehicles.length; i++) {
    const v = createdVehicles[i];
    const loc = gpsLocations[i % gpsLocations.length];

    const gpsDevice = await prisma.gpsDevice.create({
      data: {
        vehicleId: v.id,
        deviceSerial: `GPS-BB-${1000 + i}`,
        status: loc.isOut ? GpsDeviceStatus.ALERT : GpsDeviceStatus.ACTIVE,
        batteryLevel: 90 - (i * 5),
        lastSeenAt: new Date(),
      },
    });

    await prisma.gpsLog.create({
      data: {
        deviceId: gpsDevice.id,
        latitude: loc.lat,
        longitude: loc.lng,
        speed: loc.speed,
        heading: 180 + (i * 20),
        isOutOfZone: loc.isOut,
        recordedAt: new Date(),
      },
    });
  }

  console.log('📡 Created GPS Devices, Logs and Geofence alerts.');

  // 7. Create Sample Bookings
  const today = new Date();

  // Booking 1: Completed rental
  const b1Start = new Date(today);
  b1Start.setDate(today.getDate() - 10);
  const b1End = new Date(today);
  b1End.setDate(today.getDate() - 6);

  const b1 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK250501-001',
      customerId: customer1.id,
      vehicleId: createdVehicles[0].id, // Ducati Panigale V4S
      startDate: b1Start,
      endDate: b1End,
      totalDays: 4,
      rentalPrice: 34000,
      depositAmount: 50000,
      discountAmount: 3400, // 10% Gold discount
      pointsUsed: 0,
      pointsDiscount: 0,
      totalAmount: 30600,
      status: BookingStatus.COMPLETED,
      pickupLocation: 'BKK Main Branch',
      returnLocation: 'BKK Main Branch',
      actualReturnDate: b1End,
      notes: 'Customer returned in pristine condition.',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: b1.id,
      amount: 30600,
      paymentType: PaymentType.FULL_PAYMENT,
      paymentMethod: PaymentMethod.PROMPTPAY,
      status: PaymentStatus.PAID,
      transactionId: 'TXN-PP-98231201',
      paidAt: b1Start,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: b1.id,
      amount: 50000,
      paymentType: PaymentType.DEPOSIT,
      paymentMethod: PaymentMethod.PROMPTPAY,
      status: PaymentStatus.REFUNDED,
      transactionId: 'TXN-DEP-98231202',
      paidAt: b1Start,
    },
  });

  await prisma.rentalContract.create({
    data: {
      bookingId: b1.id,
      contractNumber: 'CTR-2025-001',
      terms: 'Standard Big Bike Rental Agreement. 1. Driver must hold valid big bike license. 2. Insurance coverage details. 3. Return terms.',
      customerSignature: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiPjx0ZXh0IHg9IjEwIiB5PSIyMCIgZmlsbD0iIzMzMyI+U29tY2hhaTwvdGV4dD48L3N2Zz4=',
      staffSignature: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiPjx0ZXh0IHg9IjEwIiB5PSIyMCIgZmlsbD0iIzMzMyI+U3RhZmY8L3RleHQ+PC9zdmc+',
      status: 'COMPLETED',
    },
  });

  // Booking 2: Active rental (BMW S 1000 RR)
  const b2Start = new Date(today);
  b2Start.setDate(today.getDate() - 1);
  const b2End = new Date(today);
  b2End.setDate(today.getDate() + 3);

  const b2 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK250501-002',
      customerId: customer2.id,
      vehicleId: createdVehicles[1].id, // BMW S 1000 RR
      startDate: b2Start,
      endDate: b2End,
      totalDays: 4,
      rentalPrice: 30000,
      depositAmount: 45000,
      discountAmount: 1500, // 5% Silver discount
      pointsUsed: 200,
      pointsDiscount: 200,
      totalAmount: 28300,
      status: BookingStatus.ACTIVE,
      pickupLocation: 'BKK Main Branch',
      returnLocation: 'BKK Main Branch',
      notes: 'Customer on a weekend roadtrip to Khao Yai.',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: b2.id,
      amount: 28300,
      paymentType: PaymentType.FULL_PAYMENT,
      paymentMethod: PaymentMethod.CREDIT_CARD,
      status: PaymentStatus.PAID,
      transactionId: 'TXN-CC-49021882',
      paidAt: b2Start,
    },
  });

  // Booking 3: Confirmed reservation (Ducati Streetfighter V4)
  const b3Start = new Date(today);
  b3Start.setDate(today.getDate() + 2);
  const b3End = new Date(today);
  b3End.setDate(today.getDate() + 5);

  const b3 = await prisma.booking.create({
    data: {
      bookingNumber: 'BK250501-003',
      customerId: customer3.id,
      vehicleId: createdVehicles[4].id, // Streetfighter V4
      startDate: b3Start,
      endDate: b3End,
      totalDays: 3,
      rentalPrice: 24000,
      depositAmount: 45000,
      discountAmount: 3600, // 15% Platinum discount
      pointsUsed: 500,
      pointsDiscount: 500,
      totalAmount: 19900,
      status: BookingStatus.CONFIRMED,
      pickupLocation: 'BKK Main Branch',
      returnLocation: 'BKK Main Branch',
      notes: 'VIP customer requested helmet size L.',
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: b3.id,
      amount: 19900,
      paymentType: PaymentType.FULL_PAYMENT,
      paymentMethod: PaymentMethod.PROMPTPAY,
      status: PaymentStatus.PAID,
      transactionId: 'TXN-PP-77112233',
      paidAt: new Date(),
    },
  });

  // Booking 4: Pending review
  const b4Start = new Date(today);
  b4Start.setDate(today.getDate() + 4);
  const b4End = new Date(today);
  b4End.setDate(today.getDate() + 7);

  await prisma.booking.create({
    data: {
      bookingNumber: 'BK250501-004',
      customerId: demoCustomer.id,
      vehicleId: createdVehicles[2].id, // Yamaha YZF-R1
      startDate: b4Start,
      endDate: b4End,
      totalDays: 3,
      rentalPrice: 19500,
      depositAmount: 40000,
      discountAmount: 975,
      pointsUsed: 0,
      pointsDiscount: 0,
      totalAmount: 18525,
      status: BookingStatus.PENDING,
      pickupLocation: 'BKK Main Branch',
      returnLocation: 'BKK Main Branch',
      notes: 'Waiting for staff to verify uploaded driving license.',
    },
  });

  console.log('📑 Created Sample Bookings, Payments and Contracts.');

  // 8. Create Documents
  await prisma.rentalDocument.create({
    data: {
      customerId: customer1.id,
      bookingId: b1.id,
      documentType: DocumentType.ID_CARD,
      documentNumber: '1100400123456',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      status: DocumentStatus.VERIFIED,
      verifiedBy: adminUser.name,
      verifiedAt: new Date(),
    },
  });

  await prisma.rentalDocument.create({
    data: {
      customerId: customer1.id,
      bookingId: b1.id,
      documentType: DocumentType.DRIVER_LICENSE,
      documentNumber: 'DL-66012948',
      fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      status: DocumentStatus.VERIFIED,
      verifiedBy: staffUser.name,
      verifiedAt: new Date(),
    },
  });

  // 9. Create Damage Reports
  await prisma.damageReport.create({
    data: {
      bookingId: b1.id,
      vehicleId: createdVehicles[0].id,
      description: 'Minor scratch on left exhaust shield during mountain riding.',
      estimatedCost: 2500,
      actualCost: 2500,
      deductionFromDeposit: 2500,
      evidenceImages: JSON.stringify(['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80']),
      reportedBy: staffUser.name,
      status: DamageReportStatus.DEDUCTED_FROM_DEPOSIT,
    },
  });

  // 10. Create Maintenance Logs
  await prisma.maintenanceLog.create({
    data: {
      vehicleId: createdVehicles[6].id, // Triumph Speed Triple
      maintenanceType: '10,000 KM Major Service',
      description: 'Engine oil flush, oil filter replacement, spark plugs check, chain tension adjustment and brake pads inspection.',
      cost: 6800,
      mileage: 10100,
      serviceDate: new Date(),
      status: MaintenanceStatus.IN_PROGRESS,
      performedBy: 'Bangkok Triumph Official Service Center',
    },
  });

  // 11. Create Points Transactions
  await prisma.pointsTransaction.create({
    data: {
      customerId: customer1.id,
      bookingId: b1.id,
      type: PointsTransactionType.EARN,
      points: 450,
      description: 'Earned 1.5x points from booking BK250501-001',
    },
  });

  await prisma.pointsTransaction.create({
    data: {
      customerId: customer2.id,
      bookingId: b2.id,
      type: PointsTransactionType.REDEEM,
      points: -200,
      description: 'Redeemed 200 points for ฿200 rental discount on BK250501-002',
    },
  });

  console.log('✅ Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
