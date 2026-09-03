import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Bike,
  Shield,
  Zap,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  MapPin,
  Star,
  CheckCircle,
} from 'lucide-react';

export const revalidate = 0;

export default async function HomePage() {
  const featuredBikes = await prisma.vehicle.findMany({
    take: 6,
    where: { status: { in: ['AVAILABLE', 'RESERVED', 'RENTED'] } },
    orderBy: { rentalPricePerDay: 'desc' },
  });

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section with High Visual Aesthetics */}
      <section className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Overlay & Bike image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=2000&q=80"
            alt="Big Bike Background"
            className="w-full h-full object-cover object-center filter brightness-75 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span>SUPERBIKE & BIG BIKE RENTAL IN BANGKOK</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              สัมผัสความแรงระดับ <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-rose-500 to-amber-400">
                WORLD SUPERBIKE
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              เช่ารถบิ๊กไบค์ตัวท็อป Ducati  BMW  Yamaha  Kawasaki พร้อมประกันภัยชั้น 1
              <br></br>และระบบติดตาม GPS แบบเรียลไทม์ จองง่าย สะดวก รับรถทันที
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link href="/vehicles">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-xl shadow-brand-600/30">
                  <Bike className="w-5 h-5 mr-2" /> เลือกรถบิ๊กไบค์ทั้งหมด
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-white">
                  ดูวิธีการเช่า & สัญญา
                </Button>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-800/80">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">สภาพรถเช็คศูนย์ทุกคัน</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">24/7</div>
                <div className="text-xs text-slate-400 mt-0.5">บริการช่วยเหลือฉุกเฉิน</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">GPS</div>
                <div className="text-xs text-slate-400 mt-0.5">ระบบความปลอดภัย</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fleet Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>OUR PREMIUM FLEET</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              รถบิ๊กไบค์ยอดนิยมพร้อมให้เช่า
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              เลือกขับขี่รถสปอร์ตและเน็กเก็ตไบค์สมรรถนะสูงที่คุณใฝ่ฝัน
            </p>
          </div>

          <Link href="/vehicles">
            <Button variant="outline" size="md">
              ดูรถทั้งหมด <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredBikes.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Bike Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={bike.imageUrl}
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge status={bike.status} />
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-mono font-bold backdrop-blur-md">
                  {bike.engineCC} CC
                </div>
              </div>

              {/* Bike Details */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {bike.brand}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                    {bike.model} ({bike.year})
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">แรงม้า</span>
                    <span className="font-bold text-slate-800">{bike.horsepower} HP</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">เกียร์</span>
                    <span className="font-bold text-slate-800">6 Speed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">เงินมัดจำ</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {formatCurrency(bike.depositAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs text-slate-400 block">ราคาเช่าเริ่มต้น</span>
                    <span className="text-2xl font-extrabold text-brand-600 font-mono">
                      {formatCurrency(bike.rentalPricePerDay)}
                    </span>
                    <span className="text-xs text-slate-500"> / วัน</span>
                  </div>

                  <Link href={`/vehicles/${bike.id}`}>
                    <Button variant="primary" size="md">
                      จองรถคันนี้
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works / Rental Steps */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              EASY 4-STEP BOOKING
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">ขั้นตอนการเช่ารถง่ายๆ</h2>
            <p className="text-sm text-slate-400">
              จองออนไลน์ใน 5 นาที พร้อมตรวจสอบสถานะรถว่างแบบเรียลไทม์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 font-extrabold text-xl flex items-center justify-center border border-brand-500/30">
                1
              </div>
              <h3 className="font-bold text-lg text-white">เลือกรุ่นรถและวันเช่า</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                เลือกรถบิ๊กไบค์รุ่นที่ชอบ พร้อมระบุวันรับและคืนรถ ระบบจะตรวจสอบคิวว่างทันที
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 font-extrabold text-xl flex items-center justify-center border border-brand-500/30">
                2
              </div>
              <h3 className="font-bold text-lg text-white">แนบเอกสารใบขับขี่</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                กรอกข้อมูลผู้เช่าและอัปโหลดสำเนาใบขับขี่รถจักรยานยนต์เพื่อยืนยันสิทธิ์
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 font-extrabold text-xl flex items-center justify-center border border-brand-500/30">
                3
              </div>
              <h3 className="font-bold text-lg text-white">ชำระเงินผ่าน PromptPay</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                สแกน QR Code พร้อมเพย์ชำระค่าเช่าและเงินมัดจำ ออกสัญญาเช่าดิจิทัลอัตโนมัติ
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 space-y-3 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-brand-600/20 text-brand-400 font-extrabold text-xl flex items-center justify-center border border-brand-500/30">
                4
              </div>
              <h3 className="font-bold text-lg text-white">รับรถและออกเดินทาง</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                ตรวจรับรถที่หน้าร้านสาขากรุงเทพฯ พร้อมหมวกกันน็อคและอุปกรณ์เซฟตี้ฟรี
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Perks Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 border border-brand-500/30">
          <div className="space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              BIGBIKE CLUB MEMBERSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              สะสมแต้มทุกการเช่า แลกส่วนลดสูงสุด 15%
            </h2>
            <p className="text-sm text-slate-300 max-w-xl">
              สมัครสมาชิกวันนี้ รับฟรี 100 แต้มต้อนรับทันที พร้อมรับตัวคูณแต้มสะสม
              และสิทธิพิเศษอัปเกรดรุ่นรถฟรีเมื่อเลื่อนระดับ
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link href="/membership">
              <Button variant="secondary" size="lg" className="bg-slate-900/80 hover:bg-slate-800 text-white border border-white/30">
                ดูสิทธิพิเศษสมาชิก
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="lg">
                สมัครสมาชิกฟรี
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
