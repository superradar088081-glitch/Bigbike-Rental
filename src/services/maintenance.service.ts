import { prisma } from '@/lib/db/prisma';
import { MaintenanceStatus, VehicleStatus } from '@prisma/client';

export interface CreateMaintenanceInput {
  vehicleId: string;
  maintenanceType: string;
  description: string;
  cost: number;
  mileage: number;
  serviceDate: Date | string;
  nextServiceDate?: Date | string | null;
  status?: MaintenanceStatus;
  performedBy?: string;
}

export class MaintenanceService {
  static async getLogs() {
    return prisma.maintenanceLog.findMany({
      orderBy: { serviceDate: 'desc' },
      include: {
        vehicle: true,
      },
    });
  }

  static async createLog(input: CreateMaintenanceInput) {
    const log = await prisma.maintenanceLog.create({
      data: {
        vehicleId: input.vehicleId,
        maintenanceType: input.maintenanceType,
        description: input.description,
        cost: input.cost,
        mileage: input.mileage,
        serviceDate: new Date(input.serviceDate),
        nextServiceDate: input.nextServiceDate ? new Date(input.nextServiceDate) : null,
        status: input.status || MaintenanceStatus.SCHEDULED,
        performedBy: input.performedBy,
      },
    });

    // If IN_PROGRESS, mark vehicle as MAINTENANCE
    if (input.status === MaintenanceStatus.IN_PROGRESS) {
      await prisma.vehicle.update({
        where: { id: input.vehicleId },
        data: { status: VehicleStatus.MAINTENANCE },
      });
    }

    return log;
  }

  static async updateStatus(id: string, status: MaintenanceStatus) {
    const log = await prisma.maintenanceLog.update({
      where: { id },
      data: { status },
      include: { vehicle: true },
    });

    if (status === MaintenanceStatus.COMPLETED) {
      await prisma.vehicle.update({
        where: { id: log.vehicleId },
        data: {
          status: VehicleStatus.AVAILABLE,
          mileage: log.mileage > 0 ? log.mileage : undefined,
        },
      });
    }

    return log;
  }
}
