import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET() {
  try {
    const tiers = await prisma.membershipTier.findMany({
      orderBy: { minPoints: 'asc' },
      include: {
        _count: {
          select: { customers: true },
        },
      },
    });
    return NextResponse.json({ tiers });
  } catch (error: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดึงระดับสมาชิก' }, { status: 500 });
  }
}
