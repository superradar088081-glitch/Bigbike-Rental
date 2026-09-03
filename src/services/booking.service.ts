import { prisma } from '@/lib/db/prisma';
import { BookingStatus, PaymentStatus, PaymentType, PaymentMethod, PointsTransactionType, VehicleStatus } from '@prisma/client';

export interface CreateBookingInput {
  customerId: string;
  vehicleId: string;
  startDate: Date | string;
  endDate: Date | string;
  pointsToUse?: number;
  pickupLocation?: string;
  returnLocation?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
}

export class BookingService {
  /**
   * Check if a vehicle is available for the given date range (Conflict Prevention)
   */
  static async checkAvailability(vehicleId: string, startDate: Date, endDate: Date, excludeBookingId?: string) {
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        vehicleId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.ACTIVE],
        },
        OR: [
          // Starts inside an existing range
          {
            startDate: { lte: startDate },
            endDate: { gte: startDate },
          },
          // Ends inside an existing range
          {
            startDate: { lte: endDate },
            endDate: { gte: endDate },
          },
          // Encloses an existing range
          {
            startDate: { gte: startDate },
            endDate: { lte: endDate },
          },
        ],
      },
    });

    return {
      isAvailable: overlappingBookings.length === 0,
      conflicts: overlappingBookings,
    };
  }

  /**
   * Create a new booking with price calculation, loyalty discount & conflict check
   */
  static async createBooking(input: CreateBookingInput) {
    const start = new Date(input.startDate);
    const end = new Date(input.endDate);

    if (start >= end) {
      throw new Error('วันเริ่มต้นต้องอยู่ก่อนวันสิ้นสุด');
    }

    // 1. Check availability
    const { isAvailable } = await this.checkAvailability(input.vehicleId, start, end);
    if (!isAvailable) {
      throw new Error('ขออภัย รถคันนี้ถูกจองหรือติดการใช้งานในช่วงเวลาดังกล่าวแล้ว');
    }

    // 2. Fetch vehicle & customer
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: input.vehicleId },
    });
    if (!vehicle) throw new Error('ไม่พบข้อมูลรถ');

    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
      include: { membershipTier: true },
    });
    if (!customer) throw new Error('ไม่พบข้อมูลลูกค้า');

    // 3. Calculate days & financial amounts
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const rentalPrice = vehicle.rentalPricePerDay * totalDays;
    const depositAmount = vehicle.depositAmount;

    // Membership tier discount
    const tierDiscountPercentage = customer.membershipTier?.discountPercentage || 0;
    const discountAmount = (rentalPrice * tierDiscountPercentage) / 100;

    // Points discount (1 point = 1 THB, capped at current customer points and remaining price)
    let pointsUsed = 0;
    let pointsDiscount = 0;
    if (input.pointsToUse && input.pointsToUse > 0) {
      const maxUsablePoints = Math.min(input.pointsToUse, customer.points, Math.floor(rentalPrice - discountAmount));
      pointsUsed = maxUsablePoints;
      pointsDiscount = maxUsablePoints;
    }

    const totalAmount = Math.max(0, rentalPrice - discountAmount - pointsDiscount);

    // 4. Generate unique Booking Number e.g. BK250501-8492
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingNumber = `BK${datePrefix}-${randomSuffix}`;

    // 5. Database transaction to create booking, deduct points, and generate contract draft
    const result = await prisma.$transaction(async (tx: any) => {
      // Deduct points if used
      if (pointsUsed > 0) {
        await tx.customer.update({
          where: { id: customer.id },
          data: { points: { decrement: pointsUsed } },
        });

        await tx.pointsTransaction.create({
          data: {
            customerId: customer.id,
            type: PointsTransactionType.REDEEM,
            points: -pointsUsed,
            description: `แลก ${pointsUsed} แต้ม เพื่อเป็นส่วนลดในการจอง ${bookingNumber}`,
          },
        });
      }

      // Create Booking record
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          customerId: customer.id,
          vehicleId: vehicle.id,
          startDate: start,
          endDate: end,
          totalDays,
          rentalPrice,
          depositAmount,
          discountAmount,
          pointsUsed,
          pointsDiscount,
          totalAmount,
          status: BookingStatus.PENDING,
          pickupLocation: input.pickupLocation || 'BKK Main Branch',
          returnLocation: input.returnLocation || 'BKK Main Branch',
          notes: input.notes,
        },
      });

      // Create initial Payment entry
      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: totalAmount,
          paymentType: PaymentType.FULL_PAYMENT,
          paymentMethod: input.paymentMethod || PaymentMethod.PROMPTPAY,
          status: PaymentStatus.PENDING,
        },
      });

      // Create Rental Contract skeleton
      await tx.rentalContract.create({
        data: {
          bookingId: booking.id,
          contractNumber: `CTR-${bookingNumber}`,
          terms: `ข้อตกลงและเงื่อนไขการเช่ารถจักรยานยนต์บิ๊กไบค์:\n1. ผู้เช่าต้องมีใบอนุญาตขับขี่รถจักรยานยนต์ที่ถูกต้องตามกฎหมาย\n2. ห้ามนำรถไปใช้ในการแข่งขัน ประลองความเร็ว หรือกระทำสิ่งผิดกฎหมาย\n3. ผู้เช่ายินยอมรับผิดชอบค่าเสียหายส่วนแรกในกรณีเกิดอุบัติเหตุหรือความเสียหายต่อตัวรถตามที่ระบุในสัญญา\n4. การคืนรถล่าช้าเกิน 1 ชั่วโมงจะมีค่าปรับชั่วโมงละ 500 บาท`,
          status: 'PENDING_SIGNATURE',
        },
      });

      return booking;
    });

    return result;
  }

  /**
   * Update booking status (e.g. Approve, Check-out / Handover, Return / Check-in)
   */
  static async updateStatus(id: string, status: BookingStatus, staffName?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { customer: { include: { membershipTier: true } }, vehicle: true },
    });
    if (!booking) throw new Error('ไม่พบข้อมูลการจอง');

    return prisma.$transaction(async (tx: any) => {
      // If marking as ACTIVE (handover), update vehicle status to RENTED
      if (status === BookingStatus.ACTIVE) {
        await tx.vehicle.update({
          where: { id: booking.vehicleId },
          data: { status: VehicleStatus.RENTED },
        });
      }

      // If marking as COMPLETED (return), reward points and return bike to AVAILABLE
      if (status === BookingStatus.COMPLETED) {
        await tx.vehicle.update({
          where: { id: booking.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });

        // Calculate earned points: base 1 point per 100 THB spent * multiplier
        const multiplier = booking.customer.membershipTier?.multiplier || 1.0;
        const earnedPoints = Math.floor((booking.totalAmount / 100) * multiplier);

        if (earnedPoints > 0) {
          await tx.customer.update({
            where: { id: booking.customerId },
            data: { points: { increment: earnedPoints } },
          });

          await tx.pointsTransaction.create({
            data: {
              customerId: booking.customerId,
              bookingId: booking.id,
              type: PointsTransactionType.EARN,
              points: earnedPoints,
              description: `ได้รับแต้มสะสม ${earnedPoints} แต้มจากการเช่า ${booking.bookingNumber}`,
            },
          });
        }
      }

      // If CANCELLED or REJECTED, restore bike to AVAILABLE and refund points if any
      if (status === BookingStatus.CANCELLED || status === BookingStatus.REJECTED) {
        await tx.vehicle.update({
          where: { id: booking.vehicleId },
          data: { status: VehicleStatus.AVAILABLE },
        });

        if (booking.pointsUsed > 0) {
          await tx.customer.update({
            where: { id: booking.customerId },
            data: { points: { increment: booking.pointsUsed } },
          });

          await tx.pointsTransaction.create({
            data: {
              customerId: booking.customerId,
              bookingId: booking.id,
              type: PointsTransactionType.ADJUST,
              points: booking.pointsUsed,
              description: `คืนแต้มสะสม ${booking.pointsUsed} แต้ม จากการยกเลิก ${booking.bookingNumber}`,
            },
          });
        }
      }

      return tx.booking.update({
        where: { id },
        data: {
          status,
          actualReturnDate: status === BookingStatus.COMPLETED ? new Date() : undefined,
        },
        include: {
          customer: true,
          vehicle: true,
          payments: true,
          contract: true,
        },
      });
    });
  }
}
