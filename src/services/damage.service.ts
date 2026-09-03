import { prisma } from '@/lib/db/prisma';
import { DamageReportStatus, PaymentType, PaymentMethod, PaymentStatus } from '@prisma/client';

export interface CreateDamageReportInput {
  bookingId?: string;
  vehicleId: string;
  description: string;
  estimatedCost: number;
  actualCost?: number;
  deductionFromDeposit?: number;
  evidenceImages?: string[];
  reportedBy: string;
}

export class DamageService {
  static async getReports() {
    return prisma.damageReport.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: true,
        booking: {
          include: { customer: true },
        },
      },
    });
  }

  static async createReport(input: CreateDamageReportInput) {
    const report = await prisma.damageReport.create({
      data: {
        bookingId: input.bookingId,
        vehicleId: input.vehicleId,
        description: input.description,
        estimatedCost: input.estimatedCost,
        actualCost: input.actualCost || input.estimatedCost,
        deductionFromDeposit: input.deductionFromDeposit || 0,
        evidenceImages: input.evidenceImages ? JSON.stringify(input.evidenceImages) : null,
        reportedBy: input.reportedBy,
        status: input.deductionFromDeposit && input.deductionFromDeposit > 0
          ? DamageReportStatus.DEDUCTED_FROM_DEPOSIT
          : DamageReportStatus.PENDING_REVIEW,
      },
    });

    // If deduction from deposit applies and there's a booking, record payment deduction
    if (input.bookingId && input.deductionFromDeposit && input.deductionFromDeposit > 0) {
      await prisma.payment.create({
        data: {
          bookingId: input.bookingId,
          amount: input.deductionFromDeposit,
          paymentType: PaymentType.DAMAGE_DEDUCTION,
          paymentMethod: PaymentMethod.CASH,
          status: PaymentStatus.PAID,
          notes: `หักเงินมัดจำค่าความเสียหาย: ${input.description}`,
          paidAt: new Date(),
        },
      });
    }

    return report;
  }
}
