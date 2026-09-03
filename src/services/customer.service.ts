import { prisma } from '@/lib/db/prisma';

export class CustomerService {
  static async getCustomers() {
    return prisma.customer.findMany({
      include: {
        user: { select: { email: true, name: true, avatarUrl: true } },
        membershipTier: true,
        _count: {
          select: { bookings: true, documents: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getCustomerById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        user: true,
        membershipTier: true,
        documents: { orderBy: { createdAt: 'desc' } },
        pointsTransactions: { orderBy: { createdAt: 'desc' } },
        bookings: {
          include: {
            vehicle: true,
            payments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  static async updatePoints(customerId: string, pointsDelta: number, description: string) {
    return prisma.$transaction(async (tx: any) => {
      const customer = await tx.customer.update({
        where: { id: customerId },
        data: { points: { increment: pointsDelta } },
      });

      await tx.pointsTransaction.create({
        data: {
          customerId,
          type: pointsDelta >= 0 ? 'EARN' : 'REDEEM',
          points: pointsDelta,
          description,
        },
      });

      // Recalculate tier based on total points
      const tiers = await tx.membershipTier.findMany({
        orderBy: { minPoints: 'desc' },
      });

      const matchedTier = tiers.find((t: any) => customer.points >= t.minPoints);
      if (matchedTier && matchedTier.id !== customer.membershipTierId) {
        await tx.customer.update({
          where: { id: customerId },
          data: { membershipTierId: matchedTier.id },
        });
      }

      return customer;
    });
  }
}
