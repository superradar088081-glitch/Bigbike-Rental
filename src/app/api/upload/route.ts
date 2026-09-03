import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์รูปภาพที่ต้องการอัปโหลด' }, { status: 400 });
    }

    // Validate mime type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'รองรับเฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP, GIF) เท่านั้น' }, { status: 400 });
    }

    // Validate size (max 10MB)
    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json({ error: 'ขนาดไฟล์ต้องไม่เกิน 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'vehicles');
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe filename with timestamp
    const extension = path.extname(file.name) || '.jpg';
    const cleanFileName = `vehicle_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${extension}`;
    const filePath = path.join(uploadsDir, cleanFileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/vehicles/${cleanFileName}`;
    return NextResponse.json({
      success: true,
      imageUrl,
      fileName: cleanFileName,
      message: 'อัปโหลดรูปภาพสำเร็จ',
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ' }, { status: 500 });
  }
}
