import { NextRequest, NextResponse } from 'next/server';
import { GpsService } from '@/services/gps.service';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const fleet = await GpsService.getFleetStatus();
    return NextResponse.json({ fleet });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการดึงพิกัด GPS' }, { status: 403 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { deviceId, latitude, longitude, speed, heading } = body;

    if (!deviceId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'ข้อมูลพิกัดไม่สมบูรณ์' }, { status: 400 });
    }

    const log = await GpsService.recordGpsLog(deviceId, Number(latitude), Number(longitude), Number(speed || 0), Number(heading || 0));
    return NextResponse.json({ log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการบันทึกพิกัด' }, { status: 500 });
  }
}
