import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/services/booking.service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const vehicleId = searchParams.get('vehicleId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!vehicleId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'กรุณาระบุ vehicleId, startDate, endDate ให้ครบถ้วน' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = await BookingService.checkAvailability(vehicleId, start, end);
    return NextResponse.json({
      available: result.isAvailable,
      isAvailable: result.isAvailable,
      conflicts: result.conflicts,
      message: result.isAvailable ? 'รถว่างพร้อมให้เช่า' : 'รถคันนี้ถูกจองแล้วในช่วงเวลาดังกล่าว กรุณาเลือกช่วงเวลาอื่น',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบ' }, { status: 500 });
  }
}
