import { prisma } from '@/lib/db/prisma';
import { PaymentStatus, PaymentType, PaymentMethod, BookingStatus } from '@prisma/client';
import { getPromptPayQrImageUrl } from '@/lib/utils/promptpay';

export interface CreatePaymentInput {
  bookingId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: PaymentMethod;
  slipUrl?: string;
  notes?: string;
}

export class PaymentService {
  static getPromptPayInfo(amount: number) {
    const promptpayNumber = process.env.NEXT_PUBLIC_PROMPTPAY_NUMBER || '0812345678';
    const qrImageUrl = getPromptPayQrImageUrl(promptpayNumber, amount);
    return {
      promptpayNumber,
      accountName: 'บิ๊กไบค์ เรนทัล (ประเทศไทย) จำกัด',
      qrImageUrl,
      amount,
    };
  }

  static async createPayment(input: CreatePaymentInput) {
    const txnId = `TXN-${input.paymentMethod.slice(0, 2)}-${Date.now().toString().slice(-8)}`;

    const payment = await prisma.payment.create({
      data: {
        bookingId: input.bookingId,
        amount: input.amount,
        paymentType: input.paymentType,
        paymentMethod: input.paymentMethod,
        status: PaymentStatus.PAID,
        transactionId: txnId,
        slipUrl: input.slipUrl,
        notes: input.notes,
        paidAt: new Date(),
      },
    });

    // Auto update booking to CONFIRMED if full payment is received
    if (input.paymentType === PaymentType.FULL_PAYMENT) {
      await prisma.booking.update({
        where: { id: input.bookingId },
        data: { status: BookingStatus.CONFIRMED },
      });
    }

    return payment;
  }

  static async refundDeposit(bookingId: string, refundAmount: number, damageDeduction: number = 0) {
    return prisma.$transaction(async (tx) => {
      // Create Refund Payment record
      const refund = await tx.payment.create({
        data: {
          bookingId,
          amount: refundAmount,
          paymentType: PaymentType.REFUND,
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          status: PaymentStatus.PAID,
          transactionId: `REF-${Date.now().toString().slice(-8)}`,
          notes: `คืนเงินมัดจำ ${refundAmount} บาท (หักค่าเสียหาย ${damageDeduction} บาท)`,
          paidAt: new Date(),
        },
      });

      return refund;
    });
  }

  static async getPayments(limit = 50) {
    return prisma.payment.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        booking: {
          include: {
            customer: true,
            vehicle: true,
          },
        },
      },
    });
  }
}
