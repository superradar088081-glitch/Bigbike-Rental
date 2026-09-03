import React from 'react';
import Link from 'next/link';
import { Bike, Phone, MapPin, Mail, Shield, Award, Clock } from 'lucide-react';
import { SuperbikeLogo } from '@/components/ui/SuperbikeLogo';

export const CustomerFooter = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company branding */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <SuperbikeLogo size="sm" />
              <span className="text-xl font-extrabold text-white tracking-tight">
                BIGBIKE <span className="text-brand-500">RENTAL</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              ศูนย์บริการเช่ารถบิ๊กไบค์พรีเมียมอันดับ 1 ในกรุงเทพฯ รวมซูเปอร์ไบค์ชั้นนำระดับโลก Ducati, BMW, Yamaha, Kawasaki พร้อมประกันภัยชั้น 1 และบริการดูแล 24 ชั่วโมง
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-emerald-400" /> ประกันภัยชั้น 1
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-sky-400" /> ช่วยเหลือ 24 ชม.
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">เลือกรุ่นบิ๊กไบค์</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/vehicles?brand=Ducati" className="hover:text-brand-400 transition-colors">
                  Ducati Panigale & Streetfighter
                </Link>
              </li>
              <li>
                <Link href="/vehicles?brand=BMW" className="hover:text-brand-400 transition-colors">
                  BMW S 1000 RR
                </Link>
              </li>
              <li>
                <Link href="/vehicles?brand=Yamaha" className="hover:text-brand-400 transition-colors">
                  Yamaha YZF-R1
                </Link>
              </li>
              <li>
                <Link href="/vehicles?brand=Kawasaki" className="hover:text-brand-400 transition-colors">
                  Kawasaki Ninja ZX-10R
                </Link>
              </li>
              <li>
                <Link href="/vehicles?brand=Honda" className="hover:text-brand-400 transition-colors">
                  Honda CBR1000RR-R Fireblade
                </Link>
              </li>
            </ul>
          </div>

          {/* Rental policies */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">ข้อมูลและเงื่อนไข</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/#rental-process" className="hover:text-brand-400 transition-colors">
                  ขั้นตอนและเอกสารการเช่า
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-brand-400 transition-colors">
                  สิทธิพิเศษสมาชิก BigBike Club
                </Link>
              </li>
              <li>
                <span className="text-slate-400">เงื่อนไขเงินมัดจำและการคืนรถ</span>
              </li>
              <li>
                <span className="text-slate-400">นโยบายความเป็นส่วนตัว</span>
              </li>
            </ul>
          </div>

          {/* Contact and Branch */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">ติดต่อสาขา</h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0 mt-1" />
                <span>สาขาหลัก กรุงเทพฯ (ถ.พระราม 9 แขวงห้วยขวาง กรุงเทพฯ 10310)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-500 shrink-0" />
                <span>02-888-9999, 081-234-5678</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-500 shrink-0" />
                <span>contact@bigbikerental.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 BIG BIKE RENTAL MANAGEMENT SYSTEM. All rights reserved.</p>
          <p className="mt-2 md:mt-0">ระบบจัดการเช่ารถจักรยานยนต์บิ๊กไบค์มาตรฐานสากล</p>
        </div>
      </div>
    </footer>
  );
};
