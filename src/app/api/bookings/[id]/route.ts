import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { BookingService } from '@/services/booking.service';
import { requireAuth } from '@/lib/auth/session';
import { Role, BookingStatus } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: {
          include: {
            user: true,
            membershipTier: true,
          },
        },
        vehicle: {
          include: {
            gpsDevice: true,
          },
        },
        payments: true,
        contract: true,
        damageReports: true,
        documents: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลการจอง' }, { status: 404 });
    }

    // Role check: customer can only view own booking
    if (session.role === Role.CUSTOMER && booking.customer.userId !== session.userId) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึงข้อมูลการจองนี้' }, { status: 403 });
    }

    return NextResponse.json({ booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { status, notes, customerSignature, staffSignature } = body;

    // If signature provided for contract
    if (customerSignature || staffSignature) {
      await prisma.rentalContract.updateMany({
        where: { bookingId: params.id },
        data: {
          customerSignature: customerSignature || undefined,
          staffSignature: staffSignature || undefined,
          status: 'SIGNED',
        },
      });
    }

    // If updating status (ADMIN or STAFF)
    if (status) {
      if (session.role === Role.CUSTOMER && status !== BookingStatus.CANCELLED) {
        return NextResponse.json({ error: 'ลูกค้าสามารถเปลี่ยนสถานะเป็นยกเลิกได้เท่านั้น' }, { status: 403 });
      }

      const updated = await BookingService.updateStatus(params.id, status, session.name);
      return NextResponse.json({ booking: updated });
    }

    if (notes !== undefined) {
      const updated = await prisma.booking.update({
        where: { id: params.id },
        data: { notes },
      });
      return NextResponse.json({ booking: updated });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการอัปเดต' }, { status: 400 });
  }
}
