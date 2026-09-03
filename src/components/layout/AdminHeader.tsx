'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  User,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ChevronDown,
} from 'lucide-react';

export const AdminHeader = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Search Input */}
      <div className="relative w-72 sm:w-96 hidden md:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="ค้นหาเลขที่การจอง, ลูกค้า, หรือทะเบียนรถ..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* View Customer Website Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <span>เปิดหน้าร้าน</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        {/* Notifications */}
        <button
          className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          title="แจ้งเตือน"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-600 rounded-full ring-2 ring-white animate-pulse" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 p-1.5 pr-3 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {currentUser?.name?.slice(0, 1) || 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {currentUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-brand-600 font-semibold uppercase tracking-wider block">
                {currentUser?.role || 'ADMIN'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-slate-400 text-[11px] truncate">{currentUser?.email}</p>
              </div>

              <Link
                href="/admin/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center space-x-2 px-4 py-2.5 text-slate-700 hover:bg-slate-50"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>ตั้งค่าระบบ</span>
              </Link>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
