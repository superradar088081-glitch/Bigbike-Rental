import { prisma } from '@/lib/db/prisma';
import { neonPrisma } from '@/lib/db/neon';

export class DbSyncService {
  /**
   * Test connection to both MySQL and Neon databases
   */
  static async testConnections() {
    const results = {
      mysql: { ok: false, message: '', count: 0 },
      neon: { ok: false, message: '', count: 0 },
    };

    try {
      const mysqlCount = await prisma.vehicle.count();
      results.mysql = { ok: true, message: 'Connected successfully', count: mysqlCount };
    } catch (err: any) {
      results.mysql = { ok: false, message: err.message, count: 0 };
    }

    try {
      const neonCount = await neonPrisma.vehicle.count();
      results.neon = { ok: true, message: 'Connected successfully', count: neonCount };
    } catch (err: any) {
      results.neon = { ok: false, message: err.message, count: 0 };
    }

    return results;
  }

  /**
   * Sync all core data from MySQL (phpMyAdmin) to Neon (PostgreSQL)
   */
  static async syncMysqlToNeon() {
    const logs: string[] = [];

    // 1. Sync Membership Tiers
    const tiers = await prisma.membershipTier.findMany();
    for (const tier of tiers) {
      await neonPrisma.membershipTier.upsert({
        where: { name: tier.name },
        update: {
          minPoints: tier.minPoints,
          discountPercentage: tier.discountPercentage,
          multiplier: tier.multiplier,
          color: tier.color,
          perks: tier.perks,
        },
        create: tier,
      });
    }
    logs.push(`Synced ${tiers.length} Membership Tiers`);

    // 2. Sync Users
    const users = await prisma.user.findMany();
    for (const user of users) {
      await neonPrisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          passwordHash: user.passwordHash,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
        create: user,
      });
    }
    logs.push(`Synced ${users.length} Users`);

    // 3. Sync Vehicles
    const vehicles = await prisma.vehicle.findMany();
    for (const vehicle of vehicles) {
      await neonPrisma.vehicle.upsert({
        where: { licensePlate: vehicle.licensePlate },
        update: {
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          engineCC: vehicle.engineCC,
          color: vehicle.color,
          category: vehicle.category,
          horsepower: vehicle.horsepower,
          fuelType: vehicle.fuelType,
          transmission: vehicle.transmission,
          seatHeight: vehicle.seatHeight,
          weightKg: vehicle.weightKg,
          description: vehicle.description,
          imageUrl: vehicle.imageUrl,
          images: vehicle.images,
          rentalPricePerDay: vehicle.rentalPricePerDay,
          depositAmount: vehicle.depositAmount,
          status: vehicle.status,
          mileage: vehicle.mileage,
        },
        create: vehicle,
      });
    }
    logs.push(`Synced ${vehicles.length} Vehicles`);

    return {
      success: true,
      timestamp: new Date().toISOString(),
      logs,
    };
  }
}
