import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/auth/password';
import { signJwt } from '@/lib/auth/jwt';
import { AUTH_COOKIE_NAME } from '@/lib/auth/session';
import { registerSchema } from '@/lib/validations';
import { Role } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: result.error.format() },
        { status: 400 }
      );
    }

    const { email, password, name, phone, address, idCardNumber, driverLicenseNumber } = result.data;

    // Check duplicate
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'อีเมลนี้ถูกใช้งานแล้วในระบบ' }, { status: 409 });
    }

    // Default to Bronze Tier
    const bronzeTier = await prisma.membershipTier.findFirst({
      where: { name: 'BRONZE' },
    });

    const passwordHash = await hashPassword(password);

    // Split name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || '-';

    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: Role.CUSTOMER,
        customer: {
          create: {
            firstName,
            lastName,
            phone,
            address,
            idCardNumber,
            driverLicenseNumber,
            points: 100, // Welcome gift points
            membershipTierId: bronzeTier?.id,
          },
        },
      },
      include: {
        customer: true,
      },
    });

    // Record welcome points
    if (newUser.customer) {
      await prisma.pointsTransaction.create({
        data: {
          customerId: newUser.customer.id,
          type: 'EARN',
          points: 100,
          description: 'แต้มต้อนรับสมาชิกใหม่ Big Bike Rental',
        },
      });
    }

    const token = signJwt({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      customerId: newUser.customer?.id,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        customerId: newUser.customer?.id,
      },
      token,
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' }, { status: 500 });
  }
}
