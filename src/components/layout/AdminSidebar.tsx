'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Bike,
  LayoutDashboard,
  CalendarDays,
  Users,
  CreditCard,
  Navigation,
  Wrench,
  AlertOctagon,
  Award,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { SuperbikeLogo } from '@/components/ui/SuperbikeLogo';

export const AdminSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'รถบิ๊กไบค์ (Vehicles)', href: '/admin/vehicles', icon: Bike },
    { name: 'การจอง (Bookings)', href: '/admin/bookings', icon: CalendarDays },
    { name: 'ลูกค้า (Customers)', href: '/admin/customers', icon: Users },
    { name: 'การเงิน & สลิป (Payments)', href: '/admin/payments', icon: CreditCard },
    { name: 'ติดตาม GPS & Geofence', href: '/admin/gps', icon: Navigation },
    { name: 'ตรวจสภาพ & ค่าเสียหาย', href: '/admin/damages', icon: AlertOctagon },
    { name: 'ซ่อมบำรุง (Maintenance)', href: '/admin/maintenance', icon: Wrench },
    { name: 'ระดับสมาชิก & แต้ม', href: '/admin/memberships', icon: Award },
    { name: 'รายงาน & สถิติ', href: '/admin/reports', icon: BarChart3 },
    { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 transition-all duration-300 z-30 shrink-0 select-none border-r border-slate-800',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="h-20 px-5 flex items-center justify-between border-b border-slate-800/80">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 overflow-hidden">
          <SuperbikeLogo size="sm" className="shrink-0" />
          {!collapsed && (
            <div className="transition-opacity duration-200">
              <span className="font-extrabold text-base tracking-tight text-white block">
                BIGBIKE<span className="text-brand-500">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider block -mt-1">
                SYSTEM PORTAL
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(`${item.href}/`));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all duration-150 group',
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              )}
              title={collapsed ? item.name : undefined}
            >
              <Icon
                className={cn(
                  'w-5 h-5 shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </div>

      {/* Collapse Button & Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg text-xs font-medium transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center space-x-2">
              <ChevronLeft className="w-4 h-4" />
              <span>ย่อแถบเมนู</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
