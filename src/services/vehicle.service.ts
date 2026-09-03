import { prisma } from '@/lib/db/prisma';
import { VehicleStatus, Prisma } from '@prisma/client';

export interface VehicleFilterParams {
  search?: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minCC?: number;
  maxCC?: number;
  status?: VehicleStatus;
  sortBy?: 'price_asc' | 'price_desc' | 'cc_desc' | 'popular' | 'newest';
}

export class VehicleService {
  static async getVehicles(filters: VehicleFilterParams = {}) {
    const where: Prisma.VehicleWhereInput = {};

    if (filters.search && filters.search.trim() !== '') {
      where.OR = [
        { brand: { contains: filters.search.trim() } },
        { model: { contains: filters.search.trim() } },
        { licensePlate: { contains: filters.search.trim() } },
      ];
    }

    if (filters.brand && filters.brand !== 'ALL' && filters.brand.trim() !== '') {
      where.brand = { contains: filters.brand.trim() };
    }

    if (filters.category && filters.category !== 'ALL' && filters.category.trim() !== '') {
      where.category = { contains: filters.category.trim() };
    }

    if (
      filters.status &&
      filters.status !== ('ALL' as any) &&
      Object.values(VehicleStatus).includes(filters.status)
    ) {
      where.status = filters.status;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.rentalPricePerDay = {};
      if (filters.minPrice) where.rentalPricePerDay.gte = filters.minPrice;
      if (filters.maxPrice) where.rentalPricePerDay.lte = filters.maxPrice;
    }

    if (filters.minCC || filters.maxCC) {
      where.engineCC = {};
      if (filters.minCC) where.engineCC.gte = filters.minCC;
      if (filters.maxCC) where.engineCC.lte = filters.maxCC;
    }

    let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy === 'price_asc') orderBy = { rentalPricePerDay: 'asc' };
    else if (filters.sortBy === 'price_desc') orderBy = { rentalPricePerDay: 'desc' };
    else if (filters.sortBy === 'cc_desc') orderBy = { engineCC: 'desc' };
    else if (filters.sortBy === 'newest') orderBy = { year: 'desc' };
    else if (filters.sortBy === 'popular') orderBy = { rentalPricePerDay: 'desc' };

    const vehicles = await prisma.vehicle.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return vehicles;
  }

  static async getVehicleById(id: string) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        gpsDevice: true,
        damageReports: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        maintenanceLogs: {
          orderBy: { serviceDate: 'desc' },
          take: 5,
        },
        bookings: {
          where: {
            status: { in: ['CONFIRMED', 'ACTIVE'] },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });
  }

  static async createVehicle(data: Prisma.VehicleCreateInput) {
    return prisma.vehicle.create({ data });
  }

  static async updateVehicle(id: string, data: Prisma.VehicleUpdateInput) {
    return prisma.vehicle.update({
      where: { id },
      data,
    });
  }

  static async deleteVehicle(id: string) {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}
