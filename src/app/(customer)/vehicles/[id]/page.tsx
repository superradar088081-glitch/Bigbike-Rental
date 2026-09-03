import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db/prisma';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  ShieldCheck,
  Zap,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HardHat,
  ChevronRight,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

export const revalidate = 0;

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
  });

  if (!vehicle) {
    notFound();
  }

  let images: string[] = [vehicle.imageUrl];
  if (vehicle.images) {
    try {
      const parsed = JSON.parse(vehicle.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        images = parsed;
      }
    } catch {
      images = [vehicle.imageUrl];
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-slate-900">หน้าแรก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/vehicles" className="hover:text-slate-900">รถบิ๊กไบค์ทั้งหมด</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{vehicle.brand} {vehicle.model}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Photos Gallery & Vehicle Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Photo Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200">
              <img
                src={vehicle.imageUrl}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge status={vehicle.status} />
              </div>
              <div className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-slate-900/80 text-white text-xs font-mono font-bold backdrop-blur-md">
                {vehicle.licensePlate}
              </div>
            </div>
          </div>

          {/* Title & Short Description */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              {vehicle.brand} SUPERBIKE
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed pt-2">
              {vehicle.description ||
                'รถบิ๊กไบค์สมรรถนะสูง ผ่านการตรวจเช็คสภาพตามมาตรฐานศูนย์ทุกระยะ พร้อมระบบความปลอดภัยและการติดตามตำแหน่ง GPS ตลอด 24 ชั่วโมง'}
            </p>
          </div>

          {/* Technical Specifications Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-extrabold text-slate-900">ข้อมูลสเปกทางเทคนิค (Specifications)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">ความจุกระบอกสูบ</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{vehicle.engineCC} CC</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">พละกำลังสูงสุด</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{vehicle.horsepower} HP</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">ระบบเกียร์</span>
                <span className="text-lg font-bold text-slate-900">{vehicle.transmission}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">ความสูงเบาะ</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{vehicle.seatHeight || 835} mm</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">น้ำหนักตัวรถ</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{vehicle.weightKg || 195} kg</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 block font-medium">เลขไมล์ปัจจุบัน</span>
                <span className="text-lg font-bold text-slate-900 font-mono">{formatNumber(vehicle.mileage)} km</span>
              </div>
            </div>
          </div>

          {/* Rental Terms & Insurance Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">เงื่อนไขการเช่าและความคุ้มครอง</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>ผู้เช่าต้องมีอายุ 20 ปีบริบูรณ์ขึ้นไป และมีใบอนุญาตขับขี่รถจักรยานยนต์ที่ยังไม่หมดอายุ</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>รวมประกันภัยชั้น 1 คุ้มครองความเสียหายต่อบุคคลภายนอกและตัวรถตามวงเงินกรมธรรม์</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>เงินมัดจำจะได้รับคืนเต็มจำนวนภายในวันที่ส่งมอบรถคืน หลังการตรวจสภาพเรียบร้อย</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>แถมฟรี! หมวกกันน็อคและอุปกรณ์เซฟตี้มาตรฐาน มอก./ECE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Pricing & Booking Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs text-slate-400 block font-medium">อัตราค่าเช่า</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-brand-600 font-mono">
                  {formatCurrency(vehicle.rentalPricePerDay)}
                </span>
                <span className="text-xs text-slate-500"> / วัน</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                เงินมัดจำความเสียหาย: <span className="font-bold text-slate-700 font-mono">{formatCurrency(vehicle.depositAmount)}</span> (ได้รับคืนเมื่อส่งมอบรถ)
              </p>
            </div>

            <div className="space-y-3">
              <Link href={`/booking/${vehicle.id}`} className="block">
                <Button variant="primary" size="lg" className="w-full shadow-lg shadow-brand-600/30">
                  จองรถคันนี้ทันที
                </Button>
              </Link>
              <a href="tel:0812345678" className="block">
                <Button variant="outline" size="md" className="w-full">
                  สอบถามเพิ่มเติมทางโทรศัพท์
                </Button>
              </a>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-500">
              <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>สาขาให้บริการ: กรุงเทพฯ (สุขุมวิท 71)</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-brand-600" />
                <span>เวลาเปิดรับ-ส่งรถ: 08:30 - 19:30 น.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
