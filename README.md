# BIG BIKE RENTAL MANAGEMENT SYSTEM

ระบบจัดการเช่ารถบิ๊กไบค์แบบ Full-Stack ระดับ Enterprise พร้อมระบบจองรถ, ป้องกันการจองซ้ำ (Conflict Prevention), ชำระเงิน PromptPay QR, สัญญาเช่าดิจิทัล, ติดตามตำแหน่ง GPS & Geofence Alert, บันทึกความเสียหาย & หักเงินมัดจำ, ซ่อมบำรุง และระบบสมาชิกสะสมแต้ม

---

## 1. คุณสมบัติเด่นของระบบ (Key Features)

### 🏍️ ฝั่งลูกค้า (Customer Portal)
- **หน้ารวมรถ (Vehicle Catalog)**: ค้นหาและกรองรถตามยี่ห้อ (Ducati, BMW, Yamaha, Kawasaki, Honda), ขนาดเครื่องยนต์ (CC), ราคาเช่า และสถานะความพร้อม
- **หน้ารายละเอียดรถ (Vehicle Detail)**: แสดงแกลเลอรีรูปภาพ, สเปกทางเทคนิค (HP, CC, น้ำหนัก, ความสูงเบาะ, ระบบเกียร์), ราคาเช่า และเงินมัดจำ
- **ระบบจองรถ 5 ขั้นตอน (Booking Wizard)**:
  1. เลือกวันรับ-คืนรถ (ตรวจสอบช่วงเวลาทับซ้อน ป้องกันการจองซ้ำอัตโนมัติ)
  2. ข้อมูลผู้เช่าและใบอนุญาตขับขี่
  3. สิทธิพิเศษสมาชิกและแลกแต้มสะสมเป็นส่วนลด
  4. ชำระเงินด้วย PromptPay QR พร้อมตัวนับเวลา 15 นาที
  5. ยืนยันการจองและออกสัญญาเช่าดิจิทัล
- **ระบบสมาชิกและแต้มสะสม (Membership & Points)**: 4 ระดับ (BRONZE, SILVER, GOLD, PLATINUM) พร้อมตัวคูณแต้มและส่วนลดค่าเช่า
- **การจองของฉัน (My Bookings)**: ดูประวัติการเช่าและสัญญาเช่าดิจิทัล

### 🛡️ ฝั่งผู้ดูแลระบบและพนักงาน (Admin & Staff Dashboard)
- **ภาพรวมระบบ (KPI Dashboard)**: รายได้รวม, อัตราเติบโต, จำนวนการจอง, รถที่กำลังเช่า, รถว่าง, กราฟแนวโน้มรายได้ (Revenue Area Chart) และสัดส่วนสถานะการจอง (Status Donut Chart)
- **จัดการกองยาน (Vehicle Management)**: เพิ่ม แก้ไข ปิดใช้งาน เปลี่ยนสถานะรถ ตรวจสอบประวัติการเช่า
- **จัดการการจอง (Booking Management)**: อนุมัติการจอง, ส่งมอบรถ (Check-out), รับรถคืน (Check-in), หักค่าเสียหายจากเงินมัดจำ
- **ระบบติดตาม GPS & Geofence (Live Fleet Telemetry)**: แผนที่อินเทอร์แอคทีฟแสดงตำแหน่งสด, ความเร็ว, แบตเตอรี่ และแจ้งเตือนทันทีเมื่อรถออกนอกเขตที่กำหนด (Out of Zone)
- **รายงานความเสียหาย (Damage Reports)**: บันทึกรูปหลักฐาน ค่าประเมินซ่อม และตัดยอดจากเงินมัดจำ
- **ระบบซ่อมบำรุง (Maintenance Calendar)**: บันทึกการเช็คระยะ เปลี่ยนถ่ายของเหลว และคำนวณต้นทุนการบำรุงรักษา
- **จัดการลูกค้า & แต้ม (Customer CRM)**: ค้นหารายชื่อลูกค้า ดูประวัติ และปรับปรุงแต้มสะสม
- **รายงานและสถิติ (Reports & Analytics)**: รายได้ย้อนหลัง อัตราการใช้รถ (Utilization Rate) และส่งออกข้อมูล

---

## 2. โครงสร้างเทคโนโลยี (Technology Stack)

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Next.js Route Handlers, Service Layer Pattern, Zod Validation
- **Database & ORM**: PostgreSQL (Neon Database Compatible), Prisma ORM
- **Authentication**: Custom JWT Session with secure HTTP-only cookies & Bcrypt password hashing
- **Payments**: Standard Thai EMVCo PromptPay QR Code Generator

---

## 3. การติดตั้งและเริ่มต้นใช้งาน (Installation)

### 3.1 Clone & ติดตั้ง Dependencies
```bash
git clone <repository-url>
cd Bigbike-Rental-Website-V2
npm install
```

### 3.2 ตั้งค่า Environment Variables
คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:
```bash
cp .env.example .env
```

แก้ไขค่าใน `.env`:
```env
# Neon / PostgreSQL Connection URL
DATABASE_URL="postgresql://username:password@ep-sample-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# JWT Secret
JWT_SECRET="your-super-secure-jwt-secret-key-2025"

# PromptPay Store Settings
NEXT_PUBLIC_PROMPTPAY_NUMBER="0812345678"
```

### 3.3 ซิงค์ Schema และ Seed ข้อมูลเริ่มต้น
```bash
# สร้าง Prisma Client
npx prisma generate

# พุช Schema ไปยัง Neon PostgreSQL
npx prisma db push

# รัน Seed Data ตัวอย่างรถบิ๊กไบค์ ลูกค้า การจอง พิกัด GPS
npm run prisma:seed
```

### 3.4 รันระบบใน Development Mode
```bash
npm run dev
```
เปิดบราวเซอร์ที่: `http://localhost:3000`

### 3.5 Build สำหรับ Production
```bash
npm run build
npm run start
```

---

## 4. บัญชีผู้ใช้งานสำหรับทดสอบระบบ (Seed Accounts)

| บทบาท (Role) | อีเมล (Email) | รหัสผ่าน (Password) | สิทธิ์การใช้งาน |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `Admin@1234` | สิทธิ์สูงสุด เข้าถึงทุกเมนูหลังบ้าน |
| **STAFF** | `staff@example.com` | `Staff@1234` | จัดการการจอง ส่งมอบรถ รับรถคืน ตรวจสภาพ |
| **CUSTOMER (Gold)** | `somchai@example.com` | `Customer@1234` | สมาชิก Gold (ลด 10%, 1,850 แต้ม) |
| **CUSTOMER (Silver)** | `somsri@example.com` | `Customer@1234` | สมาชิก Silver (ลด 5%, 620 แต้ม) |
| **CUSTOMER (Platinum)**| `john.miller@example.com` | `Customer@1234` | สมาชิก Platinum (ลด 15%, 3,400 แต้ม) |
| **CUSTOMER (Demo)** | `customer@example.com` | `Customer@1234` | บัญชีทดสอบสำหรับผู้ใช้ทั่วไป |

---

## 5. สถาปัตยกรรมระบบ (Architecture)

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Home Landing)
│   │   ├── vehicles/page.tsx & [id]/page.tsx
│   │   ├── booking/[id]/page.tsx
│   │   ├── my-bookings/page.tsx
│   │   ├── membership/page.tsx
│   │   └── profile/page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx (Dark sidebar + Top header)
│   │       ├── dashboard/page.tsx
│   │       ├── vehicles/page.tsx
│   │       ├── bookings/page.tsx
│   │       ├── customers/page.tsx
│   │       ├── payments/page.tsx
│   │       ├── gps/page.tsx
│   │       ├── damages/page.tsx
│   │       ├── maintenance/page.tsx
│   │       ├── memberships/page.tsx
│   │       ├── reports/page.tsx
│   │       └── settings/page.tsx
│   ├── api/ (REST API Route Handlers)
│   └── globals.css
├── components/
│   ├── ui/ (Button, Input, Badge, Card, Modal, KpiCard, RevenueChart, StatusDonutChart, GpsInteractiveMap)
│   └── layout/ (CustomerNavbar, CustomerFooter, AdminSidebar, AdminHeader)
├── lib/
│   ├── db/prisma.ts (Database singleton)
│   ├── auth/ (JWT, session, password hashing)
│   ├── validations/ (Zod validation schemas)
│   └── utils/ (Thai Baht currency, dates, PromptPay EMVCo generator)
├── services/ (Vehicle, Booking, Payment, GPS, Customer, Damage, Maintenance, Report)
└── prisma/
    ├── schema.prisma
    └── seed.ts
```
