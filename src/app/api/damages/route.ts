import { NextRequest, NextResponse } from 'next/server';
import { DamageService } from '@/services/damage.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const reports = await DamageService.getReports();
    return NextResponse.json({ reports });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth([Role.ADMIN, Role.STAFF]);
    const body = await req.json();

    const report = await DamageService.createReport({
      bookingId: body.bookingId,
      vehicleId: body.vehicleId,
      description: body.description,
      estimatedCost: Number(body.estimatedCost || 0),
      actualCost: Number(body.actualCost || body.estimatedCost || 0),
      deductionFromDeposit: Number(body.deductionFromDeposit || 0),
      evidenceImages: body.evidenceImages || [],
      reportedBy: session.name || 'Staff',
    });

    return NextResponse.json({ report }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการบันทึก' }, { status: 400 });
  }
}
