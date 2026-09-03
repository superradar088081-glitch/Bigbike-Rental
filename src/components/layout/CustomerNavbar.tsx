'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Bike,
  User,
  LogOut,
  Calendar,
  Award,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { SuperbikeLogo } from '@/components/ui/SuperbikeLogo';
import { Button } from '../ui/Button';

export const CustomerNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCurrentUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'เลือกรถบิ๊กไบค์', href: '/vehicles' },
    { name: 'เงื่อนไข & วิธีการเช่า', href: '/#how-it-works' },
    { name: 'ระดับสมาชิก & สิทธิพิเศษ', href: '/membership' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <SuperbikeLogo size="md" />
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white block">
                BIGBIKE<span className="text-brand-500">RENTAL</span>
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block -mt-1 font-semibold">
                Superbike Experience
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href === '/vehicles' && pathname.startsWith('/vehicles'));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'text-brand-400 bg-slate-800/80'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Auth Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 bg-slate-800 hover:bg-slate-700/80 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-brand-600/30 text-brand-400 flex items-center justify-center font-bold">
                    {currentUser.name.slice(0, 1).toUpperCase()}
                  </div>
                  <span>{currentUser.name}</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 py-1 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-700 text-slate-400">
                      <p className="font-semibold text-white">{currentUser.name}</p>
                      <p className="text-[11px] truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-brand-900/50 text-brand-400 text-[10px] font-bold">
                        {currentUser.role}
                      </span>
                    </div>

                    {currentUser.role === 'ADMIN' || currentUser.role === 'STAFF' ? (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-slate-700 font-semibold text-brand-400"
                      >
                        <ShieldCheck className="w-4 h-4 text-brand-400" />
                        <span>แผงควบคุมแอดมิน</span>
                      </Link>
                    ) : null}

                    <Link
                      href="/my-bookings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-slate-700"
                    >
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>ประวัติการเช่าของฉัน</span>
                    </Link>

                    <Link
                      href="/membership"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-slate-700"
                    >
                      <Award className="w-4 h-4 text-slate-400" />
                      <span>ระดับสมาชิก & แต้ม</span>
                    </Link>

                    <Link
                      href="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-slate-200 hover:bg-slate-700"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>ข้อมูลส่วนตัว</span>
                    </Link>

                    <div className="border-t border-slate-700 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-rose-400 hover:bg-rose-950/30 text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
            {currentUser ? (
              <>
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
                >
                  ประวัติการเช่าของฉัน
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-800 font-semibold"
                >
                  ออกจากระบบ ({currentUser.name})
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    เข้าสู่ระบบ
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm" className="w-full">
                    สมัครสมาชิก
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
