import { z } from 'zod';
import { VehicleStatus, BookingStatus, PaymentType, PaymentMethod, DocumentType, MaintenanceStatus } from '@prisma/client';

// Auth Schemas
export const registerSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
  phone: z.string().min(9, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
  address: z.string().optional(),
  idCardNumber: z.string().optional(),
  driverLicenseNumber: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

// Vehicle Schema
export const vehicleSchema = z.object({
  brand: z.string().min(1, 'กรุณาระบุยี่ห้อ'),
  model: z.string().min(1, 'กรุณาระบุรุ่น'),
  year: z.coerce.number().int().min(1900, 'ปีต้องตั้งแต่ 1900 ขึ้นไป'),
  engineCC: z.coerce.number().int().positive('CC ต้องมากกว่า 0'),
  licensePlate: z.string().min(1, 'กรุณากรอกทะเบียนรถ'),
  color: z.string().min(1, 'กรุณาระบุสี'),
  category: z.string().default('Super Sport'),
  horsepower: z.coerce.number().int().optional().nullable(),
  fuelType: z.string().default('Gasoline 95'),
  transmission: z.string().default('Manual 6-Speed'),
  seatHeight: z.coerce.number().int().optional().nullable(),
  weightKg: z.coerce.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'กรุณาระบุ URL รูปภาพหรืออัปโหลดรูปภาพ'),
  images: z.union([z.array(z.string()), z.string()]).optional().default([]),
  rentalPricePerDay: z.coerce.number().positive('ราคาเช่าต้องมากกว่า 0'),
  depositAmount: z.coerce.number().nonnegative('เงินมัดจำต้องไม่ติดลบ'),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
  mileage: z.coerce.number().int().nonnegative().default(0),
});

// Booking Schema
export const createBookingSchema = z.object({
  vehicleId: z.string().min(1, 'กรุณาเลือกรถที่ต้องการเช่า'),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  pointsToUse: z.number().int().nonnegative().default(0),
  pickupLocation: z.string().default('BKK Main Branch'),
  returnLocation: z.string().default('BKK Main Branch'),
  notes: z.string().optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.PROMPTPAY),
  // Customer details if booking as guest or updating profile
  customerInfo: z.object({
    firstName: z.string().min(1, 'กรุณากรอกชื่อ'),
    lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
    phone: z.string().min(9, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
    idCardNumber: z.string().optional(),
    driverLicenseNumber: z.string().optional(),
    address: z.string().optional(),
  }).optional(),
});

// Payment Schema
export const paymentSchema = z.object({
  bookingId: z.string().min(1),
  amount: z.number().positive(),
  paymentType: z.nativeEnum(PaymentType).default(PaymentType.FULL_PAYMENT),
  paymentMethod: z.nativeEnum(PaymentMethod).default(PaymentMethod.PROMPTPAY),
  slipUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Damage Report Schema
export const damageReportSchema = z.object({
  bookingId: z.string().optional(),
  vehicleId: z.string().min(1, 'กรุณาเลือกรถ'),
  description: z.string().min(5, 'กรุณากรอกรายละเอียดความเสียหาย'),
  estimatedCost: z.number().nonnegative().default(0),
  actualCost: z.number().nonnegative().default(0),
  deductionFromDeposit: z.number().nonnegative().default(0),
  evidenceImages: z.array(z.string()).default([]),
  reportedBy: z.string().min(1, 'ระบุผู้รายงาน'),
});

// Maintenance Log Schema
export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, 'กรุณาเลือกรถ'),
  maintenanceType: z.string().min(1, 'ระบุประเภทการซ่อมบำรุง'),
  description: z.string().min(3, 'กรุณากรอกรายละเอียด'),
  cost: z.number().nonnegative().default(0),
  mileage: z.number().int().nonnegative().default(0),
  serviceDate: z.string().or(z.date()),
  nextServiceDate: z.string().or(z.date()).optional().nullable(),
  status: z.nativeEnum(MaintenanceStatus).default(MaintenanceStatus.SCHEDULED),
  performedBy: z.string().optional(),
});
