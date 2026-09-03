import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/services/customer.service';
import { prisma } from '@/lib/db/prisma';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const customer = await CustomerService.getCustomerById(params.id);

    if (!customer) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลลูกค้า' }, { status: 404 });
    }

    if (session.role === Role.CUSTOMER && customer.userId !== session.userId) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์เข้าถึง' }, { status: 403 });
    }

    return NextResponse.json({ customer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const { firstName, lastName, phone, address, idCardNumber, driverLicenseNumber, pointsAdjustment, reason } = body;

    const customer = await CustomerService.getCustomerById(params.id);
    if (!customer) return NextResponse.json({ error: 'ไม่พบข้อมูล' }, { status: 404 });

    if (session.role === Role.CUSTOMER && customer.userId !== session.userId) {
      return NextResponse.json({ error: 'ไม่มีสิทธิ์แก้ไข' }, { status: 403 });
    }

    // If adjusting points (Admin only)
    if (pointsAdjustment !== undefined) {
      await requireAuth([Role.ADMIN]);
      const updated = await CustomerService.updatePoints(params.id, Number(pointsAdjustment), reason || 'ปรับปรุงแต้มโดยแอดมิน');
      return NextResponse.json({ customer: updated });
    }

    // Update profile info
    const updated = await prisma.customer.update({
      where: { id: params.id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        idCardNumber: idCardNumber || undefined,
        driverLicenseNumber: driverLicenseNumber || undefined,
      },
      include: { membershipTier: true },
    });

    return NextResponse.json({ customer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการอัปเดต' }, { status: 400 });
  }
}
