'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bike, Lock, Mail, User, Phone, AlertTriangle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
        setLoading(false);
        return;
      }

      router.push('/vehicles');
      router.refresh();
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=2000&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-20 filter brightness-75"
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-3 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl shadow-brand-600/40">
            <Bike className="w-7 h-7" />
          </div>
        </Link>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">สมัครสมาชิก BigBike Club</h2>
        <p className="text-xs text-slate-400">
          รับทันที 100 แต้มต้อนรับสมาชิกใหม่ และสิทธิพิเศษส่วนลดค่าเช่า
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border border-white/20 space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="ชื่อ - นามสกุล"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="สมชาย สุขประเสริฐ"
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="เบอร์โทรศัพท์"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081-234-5678"
              leftIcon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="อีเมล (Email)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="รหัสผ่าน (Password)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full py-3 shadow-lg shadow-brand-600/30 text-sm font-bold"
            >
              สมัครสมาชิก & รับแต้มฟรี
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            มีบัญชีสมาชิกอยู่แล้ว?{' '}
            <Link href="/login" className="text-brand-600 font-bold hover:underline">
              เข้าสู่ระบบที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
