import { NextResponse } from 'next/server';
import { ReportService } from '@/services/report.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const data = await ReportService.getDashboardKPIs();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลรายงาน' }, { status: 403 });
  }
}
