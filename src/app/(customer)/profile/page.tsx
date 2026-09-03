'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, ShieldCheck, Award, Phone, Mail, MapPin, Save, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (data.user.customer) {
            setFirstName(data.user.customer.firstName || '');
            setLastName(data.user.customer.lastName || '');
            setPhone(data.user.customer.phone || '');
            setAddress(data.user.customer.address || '');
            setIdCardNumber(data.user.customer.idCardNumber || '');
            setDriverLicenseNumber(data.user.customer.driverLicenseNumber || '');
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.customer) return;
    try {
      await fetch(`/api/customers/${user.customer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          address,
          idCardNumber,
          driverLicenseNumber,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ข้อมูลส่วนตัว (Profile)</h1>
        <p className="text-sm text-slate-500 mt-1">จัดการข้อมูลผู้ขับขี่ ที่อยู่ และเอกสารยืนยันตัวตนสำหรับเช่ารถ</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 font-extrabold text-lg flex items-center justify-center border border-brand-100">
              {firstName.slice(0, 1) || 'U'}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">{firstName} {lastName}</h3>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <Input
              label="ชื่อ (First Name)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="นามสกุล (Last Name)"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <Input
              label="เบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="เลขบัตรประจำตัวประชาชน / Passport"
              value={idCardNumber}
              onChange={(e) => setIdCardNumber(e.target.value)}
            />
          </div>

          <Input
            label="เลขที่ใบอนุญาตขับขี่รถจักรยานยนต์"
            value={driverLicenseNumber}
            onChange={(e) => setDriverLicenseNumber(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1.5">
              ที่อยู่ปัจจุบัน
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            {saved && (
              <span className="text-xs text-emerald-600 font-bold animate-in fade-in">
                ✓ บันทึกข้อมูลเรียบร้อยแล้ว
              </span>
            )}
            <Button type="submit" variant="primary" className="ml-auto">
              <Save className="w-4 h-4 mr-1.5" /> บันทึกข้อมูล
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
