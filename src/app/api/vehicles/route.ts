import { NextRequest, NextResponse } from 'next/server';
import { VehicleService } from '@/services/vehicle.service';
import { vehicleSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const category = searchParams.get('category') || undefined;
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
    const minCC = searchParams.get('minCC') ? Number(searchParams.get('minCC')) : undefined;
    const maxCC = searchParams.get('maxCC') ? Number(searchParams.get('maxCC')) : undefined;
    const status = (searchParams.get('status') as any) || undefined;
    const sortBy = (searchParams.get('sortBy') as any) || undefined;

    const vehicles = await VehicleService.getVehicles({
      search,
      brand,
      category,
      minPrice,
      maxPrice,
      minCC,
      maxCC,
      status,
      sortBy,
    });

    return NextResponse.json({ vehicles });
  } catch (error: any) {
    console.error('Fetch vehicles error:', error);
    return NextResponse.json(
      { error: error?.message || 'ไม่สามารถดึงข้อมูลรถได้' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth([Role.ADMIN, Role.STAFF]);
    const body = await req.json();
    const result = vehicleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: result.error.format() },
        { status: 400 }
      );
    }

    const newVehicle = await VehicleService.createVehicle(result.data as any);
    return NextResponse.json({ vehicle: newVehicle }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message.includes('Forbidden')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการสร้างข้อมูลรถ' }, { status: 500 });
  }
}
