import { NextRequest, NextResponse } from 'next/server';
import { CustomerService } from '@/services/customer.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const customers = await CustomerService.getCustomers();
    return NextResponse.json({ customers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลลูกค้า' }, { status: 403 });
  }
}
