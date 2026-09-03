import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment.service';
import { requireAuth } from '@/lib/auth/session';
import { Role, PaymentMethod, PaymentType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookingId = searchParams.get('bookingId');
    const getPromptPay = searchParams.get('promptpay');
    const amount = searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined;

    if (getPromptPay && amount) {
      const info = PaymentService.getPromptPayInfo(amount);
      return NextResponse.json(info);
    }

    await requireAuth([Role.ADMIN, Role.STAFF]);
    const payments = await PaymentService.getPayments(50);
    return NextResponse.json({ payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลชำระเงิน' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, amount, paymentType, paymentMethod, slipUrl, notes } = body;

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'กรุณาระบุ bookingId และจำนวนเงิน' }, { status: 400 });
    }

    const payment = await PaymentService.createPayment({
      bookingId,
      amount: Number(amount),
      paymentType: paymentType || PaymentType.FULL_PAYMENT,
      paymentMethod: paymentMethod || PaymentMethod.PROMPTPAY,
      slipUrl,
      notes,
    });

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการชำระเงิน' }, { status: 400 });
  }
}
