'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, Save, ShieldCheck, QrCode, Radio } from 'lucide-react';

export default function AdminSettingsPage() {
  const [promptpayNumber, setPromptpayNumber] = useState('0812345678');
  const [storeName, setStoreName] = useState('BIG BIKE RENTAL MANAGEMENT SYSTEM (สาขาหลัก กรุงเทพฯ)');
  const [defaultDepositRate, setDefaultDepositRate] = useState(40000);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">ตั้งค่าระบบ (Store Settings)</h1>
        <p className="text-xs text-slate-500 mt-0.5">การชำระเงิน นโยบายเงินมัดจำ ข้อมูลสาขา และการเชื่อมต่อดาวเทียม GPS</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Payment & PromptPay */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <QrCode className="w-5 h-5 text-brand-600" />
            <h3 className="font-bold text-slate-900 text-sm">การตั้งค่าการชำระเงิน PromptPay QR</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Input
              label="หมายเลข PromptPay (เบอร์โทร หรือ เลขประจำตัวผู้เสียภาษี)"
              value={promptpayNumber}
              onChange={(e) => setPromptpayNumber(e.target.value)}
              required
            />
            <Input
              label="ชื่อบัญชีรับเงิน"
              value="บิ๊กไบค์ เรนทัล (ประเทศไทย) จำกัด"
              disabled
            />
          </div>
        </div>

        {/* Store & Deposit rules */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">ข้อมูลร้านและนโยบายเงินมัดจำ</h3>
          </div>

          <div className="space-y-4 text-xs">
            <Input
              label="ชื่อสาขา / ชื่อร้าน"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="อัตราเงินมัดจำพื้นฐาน (THB)"
                type="number"
                value={defaultDepositRate}
                onChange={(e) => setDefaultDepositRate(Number(e.target.value))}
                required
              />
              <Input
                label="ระยะเวลาจำกัดการชำระเงิน (นาที)"
                type="number"
                value={15}
                disabled
              />
            </div>
          </div>
        </div>

        {/* GPS Geofence */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Radio className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-sm">ขอบเขต Geofence และความปลอดภัย</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <Input
              label="รัศมีอนุญาตขับขี่สูงสุดจากจุดศูนย์กลาง (กม.)"
              type="number"
              value={80}
              disabled
            />
            <Input
              label="พิกัดศูนย์กลาง (Latitude, Longitude)"
              value="13.7563, 100.5018 (กรุงเทพมหานคร)"
              disabled
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
              ✓ บันทึกการตั้งค่าระบบเรียบร้อยแล้ว
            </span>
          )}
          <Button type="submit" variant="primary" className="ml-auto">
            <Save className="w-4 h-4 mr-1.5" /> บันทึกการตั้งค่า
          </Button>
        </div>
      </form>
    </div>
  );
}
