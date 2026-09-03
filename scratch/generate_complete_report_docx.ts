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
  ShadingType,
  ImageRun,
} from 'docx';

function createHeaderCell(text: string, widthPercent: number) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    shading: { type: ShadingType.CLEAR, fill: '0F172A' },
    margins: { top: 120, bottom: 120, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text,
            bold: true,
            color: 'FFFFFF',
            size: 22,
            font: 'TH Sarabun New',
          }),
        ],
      }),
    ],
  });
}

function createDataCell(text: string, widthPercent: number, isCenter = false, isBold = false) {
  return new TableCell({
    width: { size: widthPercent, type: WidthType.PERCENTAGE },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
    children: [
      new Paragraph({
        alignment: isCenter ? AlignmentType.CENTER : AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: isBold,
            size: 20,
            font: 'TH Sarabun New',
          }),
        ],
      }),
    ],
  });
}

function buildTable(headers: { name: string; width: number }[], rows: (string | { text: string; center?: boolean; bold?: boolean })[][]) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map((h) => createHeaderCell(h.name, h.width)),
  });

  const dataRows = rows.map((row) => {
    return new TableRow({
      children: row.map((cell, idx) => {
        const text = typeof cell === 'string' ? cell : cell.text;
        const isCenter = typeof cell === 'object' ? !!cell.center : idx === 1 || idx === 2 || idx === 3;
        const isBold = typeof cell === 'object' ? !!cell.bold : idx === 0 || idx === 2;
        return createDataCell(text, headers[idx].width, isCenter, isBold);
      }),
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows],
  });
}

async function main() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // ==================== COVER PAGE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 800, after: 250 },
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
            spacing: { after: 250 },
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
            spacing: { after: 250 },
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
            spacing: { after: 180 },
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
            spacing: { after: 180 },
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
            spacing: { after: 180 },
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

          // ==================== TABLE OF CONTENTS ====================
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
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'บทที่ 1: ความต้องการของระบบ (Requirement) ......................................................................... 1',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'บทที่ 2: แผนภาพความสัมพันธ์ของข้อมูล (E-R Diagram & Analysis) ........................................ 4',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: '    2.1 คำอธิบายเอนทิตี (Entity Description) ....................................................................... 4',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: '    2.2 การวิเคราะห์ความสัมพันธ์และการทำ Normalization (Relationship Analysis) ................. 6',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: '    2.3 ผังแผนภาพความสัมพันธ์ (E-R Diagram) .................................................................... 8',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'บทที่ 3: ข้อมูลตารางทั้งหมด (Data Dictionary & Schema) ........................................................ 9',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'บทที่ 4: การออกแบบส่วนต่อประสานผู้ใช้ (User Interface: UI Walkthrough) ................................ 18',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'บทที่ 5: สรุปผลการพัฒนาระบบและเทคโนโลยีที่ใช้ (Tech Stack & Conclusion) ............................ 22',
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // ==================== CHAPTER 1: REQUIREMENT ====================
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            children: [
              new TextRun({
                text: 'บทที่ 1: ความต้องการของระบบ (Requirement)',
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
                text: '1.1 ที่มาและวัตถุประสงค์ของโครงงาน',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'ธุรกิจบริการเช่ารถจักรยานยนต์ขนาดใหญ่ (Big Bike) เป็นธุรกิจที่มียานพาหนะมูลค่าสูง และมีขั้นตอนที่ต้องให้ความสำคัญด้านความปลอดภัยและการบริหารจัดการที่รัดกุม โครงงาน "BIG BIKE RENTAL MANAGEMENT SYSTEM" ถูกพัฒนาขึ้นเพื่อแก้ปัญหาการจองคิวซ้ำซ้อน (Booking Overlap), การคำนวณส่วนลดสมาชิกลอยัลตี้, การชำระเงินดิจิทัล, การออกสัญญาเช่าอิเล็กทรอนิกส์, และการติดตามพิกัดดาวเทียม GPS เพื่อป้องกันการขับออกนอกรัศมีควบคุม',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: '1.2 ขอบเขตผู้ใช้งานระบบ (User Roles & Permissions)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '1. ลูกค้า (Customer): สามารถค้นหารถบิ๊กไบค์ตามยี่ห้อ (Ducati, BMW, Yamaha, Kawasaki, Honda, Suzuki, Harley-Davidson, Triumph) และขนาดเครื่องยนต์ CC, ทำการจองรถผ่าน Wizard 5 ขั้นตอน, นำแต้มสะสมมาแลกส่วนลด, ชำระเงินผ่าน PromptPay QR Code, และรับสัญญาเช่าดิจิทัล',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: '2. พนักงาน (Staff): ตรวจสอบเอกสารใบขับขี่และบัตรประชาชน, ดำเนินการส่งมอบและตรวจรับรถคืนพร้อมบันทึกเลขไมล์, บันทึกรายงานความเสียหาย (Damage Report) และหักเงินมัดจำ, วางแผนตารางการซ่อมบำรุง',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: '3. ผู้ดูแลระบบ (Admin): ดูภาพรวม KPI และกราฟรายได้, จัดการกองรถบิ๊กไบค์พร้อมระบบอัปโหลดภาพจากเครื่องคอมพิวเตอร์, ติดตามพิกัดแผนที่ GPS สด (Live Telemetry Map) และรับแจ้งเตือน Geofence เมื่อรถออกนอกรัศมี 35 กม.',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // ==================== CHAPTER 2: E-R DIAGRAM & ANALYSIS ====================
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            children: [
              new TextRun({
                text: 'บทที่ 2: แผนภาพความสัมพันธ์ของข้อมูล (E-R Diagram & Analysis)',
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
                text: '2.1 คำอธิบายเอนทิตี (Entity Description)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'ระบบฐานข้อมูลประกอบด้วย 12 เอนทิตีหลักที่ทำงานสอดประสานกันอย่างสมบูรณ์ ดังนี้:',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '1. User: เก็บข้อมูลบัญชีผู้ใช้งานระบบ อีเมล รหัสผ่านเข้ารหัส bcrypt และสิทธิ์การใช้งาน (Role: ADMIN, STAFF, CUSTOMER)',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '2. Customer: เก็บประวัติส่วนตัวของลูกค้า เบอร์โทรศัพท์ เลขบัตรประชาชน เลขที่ใบอนุญาตขับขี่ แต้มสะสม และระดับสมาชิก',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '3. MembershipTier: จัดการระดับสมาชิกลอยัลตี้ (Bronze, Silver, Gold, Platinum) อัตราเปอร์เซ็นต์ส่วนลด และตัวคูณแต้มสะสม',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '4. Vehicle: เก็บข้อมูลยานพาหนะบิ๊กไบค์ ยี่ห้อ รุ่น ขนาด CC แรงม้า เลขทะเบียน อัตราค่าเช่าต่อวัน เงินมัดจำ เลขไมล์ และสถานะรถ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '5. Booking: เอนทิตีศูนย์กลางการจอง เก็บช่วงเวลาเริ่มต้น-สิ้นสุด จำนวนวัน ยอดเงินค่าเช่า ยอดเงินมัดจำ ส่วนลด และจุดรับ-ส่งรถ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '6. Payment: บันทึกประวัติการชำระเงิน ยอดชำระ วิธีการชำระ (PromptPay, Credit Card) หลักฐานสลิปโอน และสถานะธุรกรรม',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '7. RentalContract: บันทึกข้อกำหนดสัญญาเช่าอิเล็กทรอนิกส์ เลขที่สัญญา ลายมือชื่อดิจิทัลของผู้เช่าและพนักงาน',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '8. RentalDocument: จัดเก็บไฟล์รูปภาพบัตรประชาชนและใบขับขี่ที่ลูกค้าอัปโหลด พร้อมสถานะการตรวจสอบความถูกต้องโดยพนักงาน',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '9. GpsDevice: ข้อมูลกล่องอุปกรณ์ติดตาม GPS ที่ติดตั้งประจำตัวรถแต่ละคัน ระดับแบตเตอรี่ และสถานะการเชื่อมต่อสัญญาณ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '10. GpsLog: บันทึกประวัติพิกัดดาวเทียม (Latitude, Longitude) ความเร็ว (km/h) ทิศทาง และสถานะการขับออกนอกเขตปลอดภัย (Geofence Alert)',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '11. DamageReport: บันทึกรายงานความเสียหายเมื่อคืนรถ รายละเอียดจุดเสียหาย ค่าซ่อมประเมิน และยอดเงินที่หักจากเงินมัดจำ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: '12. MaintenanceLog: บันทึกประวัติและแผนการซ่อมบำรุงตามระยะทาง เช่น การเปลี่ยนถ่ายน้ำมันเครื่อง ไส้กรอง ผ้าเบรก และค่าใช้จ่ายศูนย์',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // 2.2 Relationship Analysis & Normalization
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: '2.2 การวิเคราะห์ความสัมพันธ์และการทำ Normalization (Relationship Analysis)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'โครงสร้างฐานข้อมูลผ่านการออกแบบตามมาตรฐาน 3NF (Third Normal Form) เพื่อขจัดความซ้ำซ้อนของข้อมูล และป้องกันปัญหา Anomaly ในการ Insert/Update/Delete ดังนี้:',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• User ↔ Customer (1:1): ความสัมพันธ์แบบ 1 ต่อ 1 โดย Customer ใช้ userId เป็น Foreign Key ที่ Unique แยกบัญชีผู้ใช้กับประวัติลูกค้าอย่างเป็นระเบียบ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• MembershipTier ↔ Customer (1:M): ลูกค้า 1 คน สังกัดระดับสมาชิกได้ 1 ระดับ ณ ขณะนั้น แต่ระดับสมาชิก 1 ระดับ มีลูกค้าสังกัดได้หลายคน',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Vehicle ↔ Booking (1:M): รถบิ๊กไบค์ 1 คัน สามารถถูกจองได้หลายครั้งตามช่วงเวลาที่แตกต่างกัน โดยมีระบบ Date Overlap Check ตรวจสอบป้องกันคิวชนกัน',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Booking ↔ Payment (1:M): การจอง 1 รายการ สามารถมีธุรกรรมการจ่ายเงินได้หลายครั้ง (เช่น ค่าเช่าล่วงหน้า, การวางเงินมัดจำ, หรือค่าปรับ)',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Booking ↔ RentalContract (1:1): การจองที่ได้รับการอนุมัติจะมีสัญญาเช่าอิเล็กทรอนิกส์กำกับเพียง 1 ฉบับอย่างเคร่งครัด',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '• Vehicle ↔ GpsDevice (1:1) & GpsDevice ↔ GpsLog (1:M): รถแต่ละคันติดตั้งกล่อง GPS 1 กล่อง และกล่อง GPS บันทึกประวัติพิกัดความเร็วได้อย่างต่อเนื่อง',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: '• Vehicle ↔ DamageReport (1:M) & MaintenanceLog (1:M): เก็บรวบรวมประวัติความเสียหายและประวัติการซ่อมบำรุงของรถแต่ละคันได้อย่างครบถ้วน',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // 2.3 E-R Diagram Image
          new Paragraph({
            pageBreakBefore: true,
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: '2.3 ผังแผนภาพความสัมพันธ์ของข้อมูล (E-R Diagram)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 150, after: 200 },
            children: [
              new ImageRun({
                data: fs.readFileSync('public/er_diagram.png'),
                transformation: {
                  width: 530,
                  height: 640,
                },
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'รูปที่ 2.1 แผนภาพความสัมพันธ์ของข้อมูล (Entity-Relationship Diagram: ERD) ระบบจัดการเช่ารถบิ๊กไบค์',
                bold: true,
                size: 22,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // ==================== CHAPTER 3: DATA DICTIONARY ====================
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            children: [
              new TextRun({
                text: 'บทที่ 3: ข้อมูลตารางทั้งหมด (Data Dictionary)',
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
                text: 'โครงสร้างตารางข้อมูลทั้งหมดในฐานข้อมูล MySQL (`bigbike_rental`) บน phpMyAdmin:',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Table 1: User
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
            children: [
              new TextRun({
                text: '3.1 ตารางผู้ใช้งานระบบ (User)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสผู้ใช้งาน (CUID)'],
              ['email', 'VARCHAR(191)', 'UK', 'No', 'อีเมลสำหรับเข้าสู่ระบบ'],
              ['passwordHash', 'VARCHAR(191)', '-', 'No', 'รหัสผ่านเข้ารหัสด้วย bcrypt'],
              ['name', 'VARCHAR(191)', '-', 'No', 'ชื่อ-นามสกุล'],
              ['role', 'ENUM', 'INDEX', 'No', 'สิทธิ์: ADMIN, STAFF, CUSTOMER'],
              ['avatarUrl', 'TEXT', '-', 'Yes', 'ที่อยู่ไฟล์รูปโปรไฟล์'],
              ['createdAt', 'DATETIME', '-', 'No', 'วันเวลาที่สร้างบัญชี'],
              ['updatedAt', 'DATETIME', '-', 'No', 'วันเวลาที่แก้ไขล่าสุด'],
            ]
          ),

          // Table 2: Customer
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3.2 ตารางข้อมูลลูกค้า (Customer)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสลูกค้า (Customer ID)'],
              ['userId', 'VARCHAR(191)', 'FK, UK', 'No', 'เชื่อมโยงกับ User.id'],
              ['firstName', 'VARCHAR(191)', '-', 'No', 'ชื่อจริง'],
              ['lastName', 'VARCHAR(191)', '-', 'No', 'นามสกุล'],
              ['phone', 'VARCHAR(191)', 'INDEX', 'No', 'เบอร์โทรศัพท์มือถือ'],
              ['address', 'TEXT', '-', 'Yes', 'ที่อยู่สำหรับติดต่อ'],
              ['idCardNumber', 'VARCHAR(191)', 'INDEX', 'Yes', 'เลขบัตรประจำตัวประชาชน 13 หลัก'],
              ['driverLicenseNumber', 'VARCHAR(191)', '-', 'Yes', 'เลขที่ใบอนุญาตขับขี่'],
              ['points', 'INT', '-', 'No', 'แต้มสะสมคงเหลือปัจจุบัน'],
              ['membershipTierId', 'VARCHAR(191)', 'FK', 'Yes', 'เชื่อมโยงกับ MembershipTier.id'],
            ]
          ),

          // Table 3: MembershipTier
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3.3 ตารางระดับสมาชิก (MembershipTier)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสระดับสมาชิก'],
              ['name', 'VARCHAR(191)', 'UK', 'No', 'ชื่อระดับ (Bronze, Silver, Gold, Platinum)'],
              ['minPoints', 'INT', '-', 'No', 'แต้มสะสมขั้นต่ำในการเลื่อนระดับ'],
              ['discountPercentage', 'FLOAT', '-', 'No', 'เปอร์เซ็นต์ส่วนลดค่าเช่า (เช่น 10.0%)'],
              ['multiplier', 'FLOAT', '-', 'No', 'ตัวคูณอัตราการได้รับแต้มสะสม (เช่น 1.5x)'],
              ['color', 'VARCHAR(191)', '-', 'No', 'รหัสสีประจำระดับสมาชิก'],
              ['perks', 'TEXT', '-', 'Yes', 'รายละเอียดสิทธิประโยชน์'],
            ]
          ),

          // Table 4: Vehicle
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '3.4 ตารางข้อมูลรถบิ๊กไบค์ (Vehicle)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสประจำตัวรถ'],
              ['brand', 'VARCHAR(191)', 'INDEX', 'No', 'ยี่ห้อ (Suzuki, Ducati, BMW, Yamaha...)'],
              ['model', 'VARCHAR(191)', '-', 'No', 'รุ่นรถ (เช่น Hayabusa GSX1300R, S1000RR)'],
              ['year', 'INT', '-', 'No', 'ปีผลิตของตัวรถ'],
              ['engineCC', 'INT', 'INDEX', 'No', 'ขนาดความจุกระบอกสูบ (ซีซี)'],
              ['licensePlate', 'VARCHAR(191)', 'UK', 'No', 'เลขทะเบียนรถ (เช่น 9กท 1340)'],
              ['color', 'VARCHAR(191)', '-', 'No', 'สีของตัวรถ'],
              ['category', 'VARCHAR(191)', '-', 'No', 'ประเภทรถ (Super Sport, Naked, Touring)'],
              ['horsepower', 'INT', '-', 'Yes', 'พละกำลังสูงสุด (แรงม้า)'],
              ['fuelType', 'VARCHAR(191)', '-', 'No', 'ประเภทน้ำมันเชื้อเพลิง'],
              ['transmission', 'VARCHAR(191)', '-', 'No', 'ระบบเกียร์'],
              ['rentalPricePerDay', 'FLOAT', 'INDEX', 'No', 'อัตราค่าเช่าต่อวัน (บาท)'],
              ['depositAmount', 'FLOAT', '-', 'No', 'วงเงินมัดจำความเสียหาย (บาท)'],
              ['status', 'ENUM', 'INDEX', 'No', 'AVAILABLE, RESERVED, RENTED, MAINTENANCE'],
              ['mileage', 'INT', '-', 'No', 'เลขไมล์สะสมล่าสุด (กม.)'],
              ['imageUrl', 'TEXT', '-', 'No', 'ที่อยู่ไฟล์รูปภาพหลัก'],
              ['images', 'TEXT', '-', 'Yes', 'JSON String รายการรูปภาพเพิ่มเติม'],
            ]
          ),

          // Table 5: Booking
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3.5 ตารางรายการจอง (Booking)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสรายการจอง'],
              ['bookingNumber', 'VARCHAR(191)', 'UK', 'No', 'หมายเลขใบจอง เช่น BK250501-001'],
              ['customerId', 'VARCHAR(191)', 'FK', 'No', 'เชื่อมโยงกับ Customer.id'],
              ['vehicleId', 'VARCHAR(191)', 'FK', 'No', 'เชื่อมโยงกับ Vehicle.id'],
              ['startDate', 'DATETIME', 'INDEX', 'No', 'วันเวลาที่รับรถ'],
              ['endDate', 'DATETIME', 'INDEX', 'No', 'วันเวลาที่คืนรถ'],
              ['totalDays', 'INT', '-', 'No', 'จำนวนวันเช่ารวม'],
              ['rentalPrice', 'FLOAT', '-', 'No', 'ค่าเช่ารวม'],
              ['depositAmount', 'FLOAT', '-', 'No', 'เงินมัดจำความเสียหาย'],
              ['discountAmount', 'FLOAT', '-', 'No', 'ส่วนลดจากระดับสมาชิก'],
              ['pointsUsed', 'INT', '-', 'No', 'แต้มสะสมที่นำมาแลกส่วนลด'],
              ['totalAmount', 'FLOAT', '-', 'No', 'ยอดชำระสุทธิ (ค่าเช่า + มัดจำ - ส่วนลด)'],
              ['status', 'ENUM', 'INDEX', 'No', 'PENDING, CONFIRMED, ACTIVE, COMPLETED'],
              ['pickupLocation', 'VARCHAR(191)', '-', 'No', 'สถานที่รับรถ'],
              ['returnLocation', 'VARCHAR(191)', '-', 'No', 'สถานที่คืนรถ'],
            ]
          ),

          // Table 6: Payment
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 250, after: 150 },
            children: [
              new TextRun({
                text: '3.6 ตารางการชำระเงิน (Payment)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสรายการชำระเงิน'],
              ['bookingId', 'VARCHAR(191)', 'FK', 'No', 'เชื่อมโยงกับ Booking.id'],
              ['amount', 'FLOAT', '-', 'No', 'จำนวนเงินที่ชำระ'],
              ['paymentType', 'ENUM', '-', 'No', 'FULL_PAYMENT, DEPOSIT, REFUND'],
              ['paymentMethod', 'ENUM', '-', 'No', 'PROMPTPAY, CREDIT_CARD, BANK_TRANSFER'],
              ['status', 'ENUM', 'INDEX', 'No', 'PENDING, PAID, FAILED, REFUNDED'],
              ['transactionId', 'VARCHAR(191)', '-', 'Yes', 'รหัสอ้างอิงธุรกรรมธนาคาร'],
              ['slipUrl', 'TEXT', '-', 'Yes', 'ที่อยู่ไฟล์รูปภาพสลิปโอนเงิน'],
              ['paidAt', 'DATETIME', '-', 'Yes', 'วันเวลาที่ชำระเงินสำเร็จ'],
            ]
          ),

          // Table 7: RentalContract
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3.7 ตารางสัญญาเช่าดิจิทัล (RentalContract)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id', 'VARCHAR(191)', 'PK', 'No', 'รหัสสัญญาเช่า'],
              ['bookingId', 'VARCHAR(191)', 'FK, UK', 'No', 'เชื่อมโยงกับ Booking.id (1:1)'],
              ['contractNumber', 'VARCHAR(191)', 'UK', 'No', 'เลขที่สัญญา เช่น CTR-2026-0001'],
              ['contractDate', 'DATETIME', '-', 'No', 'วันเวลาที่ออกสัญญา'],
              ['terms', 'TEXT', '-', 'No', 'ข้อกำหนดและเงื่อนไขความคุ้มครอง'],
              ['customerSignature', 'TEXT', '-', 'Yes', 'ลายมือชื่อดิจิทัลของผู้เช่า'],
              ['staffSignature', 'TEXT', '-', 'Yes', 'ลายมือชื่อดิจิทัลของพนักงาน'],
              ['status', 'VARCHAR(191)', '-', 'No', 'สถานะสัญญา (ACTIVE, CLOSED)'],
            ]
          ),

          // Table 8: GpsDevice & Log
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: '3.8 ตารางอุปกรณ์ติดตาม GPS และบันทึกพิกัด (GpsDevice & GpsLog)',
                bold: true,
                size: 26,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          buildTable(
            [
              { name: 'Field Name', width: 20 },
              { name: 'Data Type', width: 16 },
              { name: 'Key', width: 12 },
              { name: 'Null', width: 10 },
              { name: 'Description', width: 42 },
            ],
            [
              ['id (GpsDevice)', 'VARCHAR(191)', 'PK', 'No', 'รหัสกล่อง GPS'],
              ['vehicleId', 'VARCHAR(191)', 'FK, UK', 'No', 'เชื่อมโยงกับ Vehicle.id'],
              ['deviceSerial', 'VARCHAR(191)', 'UK', 'No', 'หมายเลข Serial ประจำกล่อง'],
              ['batteryLevel', 'INT', '-', 'No', 'ระดับแบตเตอรี่สำรอง (%)'],
              ['latitude (GpsLog)', 'FLOAT', '-', 'No', 'พิกัดละติจูด'],
              ['longitude (GpsLog)', 'FLOAT', '-', 'No', 'พิกัดลองจิจูด'],
              ['speed', 'FLOAT', '-', 'No', 'ความเร็วรถ ณ ขณะนั้น (km/h)'],
              ['isOutOfZone', 'BOOLEAN', '-', 'No', 'แจ้งเตือนขับออกนอกรัศมีปลอดภัย 35 กม.'],
              ['recordedAt', 'DATETIME', 'INDEX', 'No', 'วันเวลาที่บันทึกพิกัด'],
            ]
          ),

          // ==================== CHAPTER 4 & 5: UI & CONCLUSION ====================
          new Paragraph({
            pageBreakBefore: true,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 300 },
            children: [
              new TextRun({
                text: 'บทที่ 4: การออกแบบส่วนต่อประสานผู้ใช้ (User Interface: UI)',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'การออกแบบ UI ยึดหลัก Modern Automotive & Dark Glassmorphism ผสมผสานความสวยงามระดับพรีเมียมและความชัดเจนของข้อมูล:',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '1. หน้าแรก (Landing Page): แสดงภาพ Superbike Hero, แถบสถิติความปลอดภัย 100%, และรายการรถแนะนำ',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '2. หน้ารวมรถ (Catalog): มีตัวกรองยี่ห้อ (Brand Pills), ขนาด CC, ราคา และป้ายสถานะสีสดคมชัด',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '3. หน้าจอง 5 ขั้นตอน (Booking Wizard): เช็ควันว่างอัตโนมัติ คำนวณส่วนลดแต้ม สร้าง PromptPay QR พร้อมเลขนับถอยหลัง 15 นาที',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: '4. แผงควบคุมแอดมิน (Admin Dashboard): แสดงกราฟรายได้ Bezier Curve, สถิติ KPI, และตารางจัดการกองรถพร้อมฟังก์ชันอัปโหลดภาพจากเครื่องคอมพิวเตอร์',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 250 },
            children: [
              new TextRun({
                text: '5. แผนที่ติดตาม GPS สด (Live Telemetry Map): แสดงแผนที่ถนน Leaflet Interactive Map พิกัดกรุงเทพฯ ปักหมุดไฟกระพริบ และแจ้งเตือน Geofence 35 กม.',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
            children: [
              new TextRun({
                text: 'บทที่ 5: สรุปผลการพัฒนาระบบและเทคโนโลยีที่ใช้ (Tech Stack)',
                bold: true,
                size: 30,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 150 },
            children: [
              new TextRun({
                text: 'ระบบพัฒนาด้วยเทคโนโลยี Full-Stack ทันสมัย: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Leaflet Map, Prisma ORM v5.22, และฐานข้อมูล MySQL บน phpMyAdmin (Port 3306) ทำงานร่วมกันได้อย่างเสถียร รวดเร็ว และปลอดภัย',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),

          // Signature section
          new Paragraph({
            spacing: { before: 600, after: 150 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'ลงชื่อผู้จัดทำ ...........................................................',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: '( นางสาวจีรนันท์ เกิดกล้า )',
                bold: true,
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 100 },
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'รหัสนักศึกษา 6712732121',
                size: 24,
                font: 'TH Sarabun New',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
              new TextRun({
                text: 'วันที่ 3 กันยายน 2568',
                size: 24,
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
  console.log('✅ Successfully compiled public/BIGBIKE_RENTAL_REPORT_6712732121.docx with full academic tables!');
}

main().catch(console.error);
