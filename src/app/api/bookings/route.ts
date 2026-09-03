import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { BookingService } from '@/services/booking.service';
import { createBookingSchema } from '@/lib/validations';
import { requireAuth, getCurrentSession } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;

    let where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // If customer, only view own bookings
    if (session.role === Role.CUSTOMER) {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.userId },
      });
      if (!customer) {
        return NextResponse.json({ bookings: [] });
      }
      where.customerId = customer.id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          include: {
            user: { select: { email: true, name: true } },
            membershipTier: true,
          },
        },
        vehicle: true,
        payments: true,
        contract: true,
        damageReports: true,
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
    }
    return NextResponse.json({ error: 'ไม่สามารถดึงข้อมูลการจองได้' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    const body = await req.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'ข้อมูลการจองไม่ถูกต้อง', details: result.error.format() },
        { status: 400 }
      );
    }

    let customerId = session?.customerId;

    // If user is not logged in or doesn't have customerId, check if customerInfo was passed
    if (!customerId && session) {
      const customer = await prisma.customer.findUnique({
        where: { userId: session.userId },
      });
      customerId = customer?.id;
    }

    if (!customerId) {
      return NextResponse.json(
        { error: 'กรุณาเข้าสู่ระบบก่อนทำการจอง หรือกรอกข้อมูลให้ครบถ้วน' },
        { status: 401 }
      );
    }

    const booking = await BookingService.createBooking({
      customerId,
      vehicleId: result.data.vehicleId,
      startDate: result.data.startDate,
      endDate: result.data.endDate,
      pointsToUse: result.data.pointsToUse,
      pickupLocation: result.data.pickupLocation,
      returnLocation: result.data.returnLocation,
      notes: result.data.notes,
      paymentMethod: result.data.paymentMethod,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: error.message || 'เกิดข้อผิดพลาดในการสร้างการจอง' },
      { status: 400 }
    );
  }
}
