'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bike, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin@1234');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      if (data.user.role === 'ADMIN' || data.user.role === 'STAFF') {
        router.push('/admin/dashboard');
      } else {
        router.push('/vehicles');
      }
      router.refresh();
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Graphic Accent */}
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
        <h2 className="text-2xl font-extrabold text-white tracking-tight">เข้าสู่ระบบ</h2>
        <p className="text-xs text-slate-400">
          BIG BIKE RENTAL MANAGEMENT SYSTEM
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

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="อีเมล (Email)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="รหัสผ่าน (Password)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />

            {/* Quick test credential pills */}
            <div className="pt-2 text-slate-500 text-[11px] space-y-1">
              <span className="font-bold block text-slate-700">บัญชีทดสอบระบบ (คลิกเพื่อเลือก):</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setEmail('admin@example.com'); setPassword('Admin@1234'); }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700"
                >
                  Admin (admin@example.com)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('staff@example.com'); setPassword('Staff@1234'); }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700"
                >
                  Staff (staff@example.com)
                </button>
                <button
                  type="button"
                  onClick={() => { setEmail('customer@example.com'); setPassword('Customer@1234'); }}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700"
                >
                  Customer (customer@example.com)
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full py-3 shadow-lg shadow-brand-600/30 text-sm font-bold"
            >
              เข้าสู่ระบบ
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            ยังไม่มีบัญชีสมาชิก?{' '}
            <Link href="/register" className="text-brand-600 font-bold hover:underline">
              สมัครสมาชิกที่นี่
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
