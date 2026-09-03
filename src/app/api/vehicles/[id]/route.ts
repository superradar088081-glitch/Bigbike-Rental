import { NextRequest, NextResponse } from 'next/server';
import { VehicleService } from '@/services/vehicle.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vehicle = await VehicleService.getVehicleById(params.id);
    if (!vehicle) {
      return NextResponse.json({ error: 'ไม่พบข้อมูลรถ' }, { status: 404 });
    }
    return NextResponse.json({ vehicle });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลรถ' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const body = await req.json();
    const updated = await VehicleService.updateVehicle(params.id, body);
    return NextResponse.json({ vehicle: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการอัปเดต' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth([Role.ADMIN]);
    await VehicleService.deleteVehicle(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการลบ' }, { status: 500 });
  }
}
