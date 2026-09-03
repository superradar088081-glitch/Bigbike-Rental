import fs from 'fs';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
} from 'docx';

async function generateReport() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Cover Page
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 300 },
            children: [
              new TextRun({
                text: 'รายงานโครงงานพัฒนาระบบฐานข้อมูล',
                bold: true,
                size: 36,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({
                text: 'เรื่อง: ระบบจัดการเช่ารถบิ๊กไบค์ (BIG BIKE RENTAL MANAGEMENT SYSTEM)',
                bold: true,
                size: 32,
                color: 'E11D48',
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'จัดทำโดย',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({
                text: 'นางสาวจีรนันท์ เกิดกล้า  รหัสนักศึกษา 6712732121',
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'เสนอ',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1200 },
            children: [
              new TextRun({
                text: 'ผู้ช่วยศาสตราจารย์ ดร.กนิษฐา อินธิชิต',
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'รายงานนี้เป็นส่วนหนึ่งของรายวิชาระบบฐานข้อมูล ( 4123202+ )',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'ภาคเรียนที่ 2 ปีการศึกษา 2568',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'สาขาวิทยาการคอมพิวเตอร์ คณะศิลปศาสตร์และวิทยาศาสตร์',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 1600 },
            children: [
              new TextRun({
                text: 'มหาวิทยาลัยราชภัฏศรีสะเกษ',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Page Break / Table of Contents
          new Paragraph({
            pageBreakBefore: true,
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 600 },
            children: [
              new TextRun({
                text: 'สารบัญ (Table of Contents)',
                bold: true,
                size: 32,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '1. ความต้องการของระบบ (Requirement) ................................................................ 1',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '2. แผนภาพความสัมพันธ์ของข้อมูล (E-R Diagram) ..................................................... 3',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '3. พจนานุกรมข้อมูล (Data Dictionary) ..................................................................... 5',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '4. การออกแบบส่วนต่อประสานผู้ใช้ (User Interface: UI) ............................................... 10',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: '5. สรุปผลการพัฒนาระบบและเทคโนโลยีที่ใช้ (Tech Stack) ............................................ 14',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Chapter 1
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: '1. ความต้องการของระบบ (Requirement)',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ระบบจัดการเช่ารถบิ๊กไบค์ (BIG BIKE RENTAL MANAGEMENT SYSTEM) เป็นระบบเว็บแอปพลิเคชันแบบ Full-Stack เพื่อบริหารจัดการร้านเช่ารถบิ๊กไบค์ขนาดใหญ่สำหรับ 1 สาขาหลัก (สุขุมวิท 71) มีขอบเขตการทำงานครอบคลุมตั้งแต่การค้นหา การจอง การชำระเงิน การออกสัญญาดิจิทัล การติดตามตำแหน่ง GPS ไปจนถึงการซ่อมบำรุง',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: 'ฟังก์ชันหลักของระบบ (Core Features):',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '1. ระบบค้นหาและคัดกรองรถบิ๊กไบค์ (Fleet Catalog & Filter): รองรับการกรองตามยี่ห้อ (Ducati, BMW, Yamaha, Kawasaki, Honda, Suzuki, Harley, Triumph), ขนาด CC และสถานะ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '2. ระบบจอง 5 ขั้นตอน พร้อมตรวจสอบคิวว่างอัตโนมัติ (Booking Conflict Prevention): ป้องกันการจองช่วงเวลาซ้ำซ้อนอย่างแม่นยำ 100%',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '3. ระบบสะสมแต้มและสิทธิพิเศษสมาชิก (Loyalty Point & Tier Discounts): มีระดับ Bronze, Silver, Gold, Platinum พร้อมตัวคูณแต้มและส่วนลดค่าเช่าอัตโนมัติ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '4. ระบบชำระเงินดิจิทัล (Digital Payment): สร้าง PromptPay QR Code พร้อมตัวจับเวลานับถอยหลัง 15 นาที',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '5. ระบบสัญญาเช่าดิจิทัล (Digital Rental Contract): บันทึกข้อตกลงความคุ้มครอง ลายมือชื่ออิเล็กทรอนิกส์ และเลขที่สัญญาเช่าอัตโนมัติ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '6. ระบบติดตามแผนที่ GPS แบบเรียลไทม์ (Live Interactive Map & Geofence): แสดงตำแหน่งพิกัด ความเร็ว แบตเตอรี่ และแจ้งเตือนเมื่อขับออกนอกรัศมีปลอดภัย 35 กม.',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '7. ระบบอัปโหลดรูปภาพรถบิ๊กไบค์จากเครื่อง (Local File Upload): แอดมินสามารถอัปโหลดรูปถ่ายตัวรถจากเครื่องคอมพิวเตอร์เข้าสู่ระบบได้โดยตรง',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Chapter 2
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: '2. แผนภาพความสัมพันธ์ของข้อมูล (E-R Diagram)',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'ฐานข้อมูลประกอบด้วย 12 ตารางหลัก ทำงานประสานกันตามหลักการ 3NF (Third Normal Form):',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• User (1) ↔ Customer (1): บัญชีผู้ใช้งานผูกกับประวัติลูกค้า',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• MembershipTier (1) ↔ Customer (M): ระดับสมาชิกกำกับส่วนลดของลูกค้า',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Customer (1) ↔ Booking (M): ลูกค้าสามารถทำรายการจองได้หลายรายการ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Vehicle (1) ↔ Booking (M): รถบิ๊กไบค์ 1 คันมีประวัติการจองหลายช่วงเวลา',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Booking (1) ↔ Payment (M): การจอง 1 รายการผูกกับธุรกรรมการชำระเงิน',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Booking (1) ↔ RentalContract (1): การจองที่สำเร็จจะมีสัญญาเช่ากำกับ 1 ฉบับ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Vehicle (1) ↔ GpsDevice (1) ↔ GpsLog (M): รถติดตั้งกล่อง GPS บันทึกพิกัดต่อเนื่อง',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• Vehicle (1) ↔ DamageReport (M) & MaintenanceLog (M): ประวัติการเคลมและการซ่อมบำรุง',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Chapter 3
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: '3. ข้อมูลตารางทั้งหมด (Data Dictionary)',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'โครงสร้างตารางข้อมูลในระบบฐานข้อมูล MySQL (bigbike_rental) บน phpMyAdmin:',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '3.1 ตารางข้อมูลรถบิ๊กไบค์ (Vehicle)',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• id (PK, VARCHAR(191)): รหัสประจำตัวรถ (CUID)\n• brand (VARCHAR(191), INDEX): ยี่ห้อรถ (Suzuki, Ducati, BMW, Yamaha...)\n• model (VARCHAR(191)): รุ่นรถ (เช่น Hayabusa GSX1300R, S1000RR)\n• year (INT): ปีที่ผลิต\n• engineCC (INT, INDEX): ขนาดความจุกระบอกสูบ (เช่น 1,340 CC)\n• licensePlate (UK, VARCHAR(191)): เลขทะเบียนรถ (เช่น 9กท 1340)\n• color (VARCHAR(191)): สีของตัวรถ\n• horsepower (INT): แรงม้า (HP)\n• rentalPricePerDay (FLOAT, INDEX): อัตราค่าเช่าต่อวัน (บาท)\n• depositAmount (FLOAT): วงเงินมัดจำความเสียหาย (บาท)\n• status (ENUM, INDEX): AVAILABLE, RESERVED, RENTED, MAINTENANCE\n• mileage (INT): เลขไมล์สะสมล่าสุด\n• imageUrl (TEXT): ที่อยู่ไฟล์ภาพตัวรถ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '3.2 ตารางรายการจอง (Booking)',
                bold: true,
                size: 28,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '• id (PK, VARCHAR(191)): รหัสการจอง\n• bookingNumber (UK, VARCHAR(191)): หมายเลขใบจอง เช่น BK250501-001\n• customerId (FK, VARCHAR(191)): เชื่อมโยงกับ Customer.id\n• vehicleId (FK, VARCHAR(191)): เชื่อมโยงกับ Vehicle.id\n• startDate / endDate (DATETIME, INDEX): วันเวลารับ-คืนรถ\n• totalDays (INT): จำนวนวันเช่ารวม\n• rentalPrice / totalAmount (FLOAT): ยอดเงินค่าเช่าและยอดชำระสุทธิ\n• discountAmount (FLOAT): มูลค่าส่วนลดจากสมาชิกระดับ Gold/Silver\n• status (ENUM, INDEX): PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELLED\n• pickupLocation / returnLocation (VARCHAR(191)): จุดรับ-คืนรถ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Chapter 4 & 5
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 400 },
            children: [
              new TextRun({
                text: '4. ส่วนต่อประสานผู้ใช้ (User Interface: UI) & สรุปผล',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'ระบบถูกออกแบบด้วยธีม Modern Automotive Dark Glassmorphism ผสมผสานความสวยงามระดับพรีเมียมและฟังก์ชันการใช้งานที่ง่ายดาย:',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '1. หน้าแรก (Landing Page): แสดง Hero Superbike, ตัววัดสถิติ 100%, 24/7, GPS และการ์ดรถแนะนำ',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '2. หน้ารวมรถ (Catalog Page): แถบกรองยี่ห้อ (Brand Pills), กรอง CC, กรองราคา และป้ายสถานะสีสดคมชัด',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '3. หน้าจอง 5 ขั้นตอน (Booking Wizard): ป้องกันการจองชนวัน คำนวณส่วนลดแต้ม สร้าง QR Code ชำระเงิน และออกสัญญาดิจิทัล',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '4. แผงควบคุมแอดมิน (Admin Dashboard): กราฟแนวโน้มรายได้ Bezier Curve, KPI Metrics, และการจัดการรถพร้อมปุ่มอัปโหลดรูปจากเครื่อง',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '5. แผนที่ติดตาม GPS สด (Live Telemetry Map): แผนที่ถนน Leaflet Interactive Map ซูมหาตำแหน่งรถ ปักหมุดไฟกระพริบ และแจ้งเตือน Geofence 35 กม.',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('public/BIGBIKE_RENTAL_REPORT_6712732121.docx', buffer);
  console.log('✅ Successfully generated public/BIGBIKE_RENTAL_REPORT_6712732121.docx!');
}

generateReport().catch(console.error);
