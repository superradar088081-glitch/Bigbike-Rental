import { NextRequest, NextResponse } from 'next/server';
import { MaintenanceService } from '@/services/maintenance.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const logs = await MaintenanceService.getLogs();
    return NextResponse.json({ logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth([Role.ADMIN, Role.STAFF]);
    const body = await req.json();

    const log = await MaintenanceService.createLog({
      vehicleId: body.vehicleId,
      maintenanceType: body.maintenanceType,
      description: body.description,
      cost: Number(body.cost || 0),
      mileage: Number(body.mileage || 0),
      serviceDate: body.serviceDate || new Date(),
      nextServiceDate: body.nextServiceDate || null,
      status: body.status,
      performedBy: body.performedBy || session.name,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการบันทึกซ่อมบำรุง' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const body = await req.json();
    const { id, status } = body;

    const updated = await MaintenanceService.updateStatus(id, status);
    return NextResponse.json({ log: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาด' }, { status: 400 });
  }
}
