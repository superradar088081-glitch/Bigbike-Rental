'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { KpiCard } from '@/components/ui/KpiCard';
import { RevenueChart } from '@/components/ui/RevenueChart';
import { StatusDonutChart } from '@/components/ui/StatusDonutChart';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  DollarSign,
  CalendarDays,
  Bike,
  Users,
  Navigation,
  ArrowUpRight,
  ShieldCheck,
  Wrench,
  AlertTriangle,
  Loader2,
  TrendingUp,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reports')
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-xs text-slate-500">กำลังโหลดข้อมูล Dashboard...</p>
      </div>
    );
  }

  const kpi = data?.kpi || {
    totalRevenue: 0,
    totalBookings: 0,
    rentedVehicles: 0,
    availableVehicles: 0,
    totalCustomers: 0,
  };

  const sampleRecentBookings = [
    { id: '1', bookingNumber: 'BK250501-001', customerName: 'คุณธนกร', vehicleName: 'Panigale V4S', startDate: '2025-05-01', endDate: '2025-05-05', status: 'PENDING', amount: 35000 },
    { id: '2', bookingNumber: 'BK250501-002', customerName: 'คุณศิริวรรณ', vehicleName: 'S 1000 RR', startDate: '2025-05-01', endDate: '2025-05-05', status: 'CONFIRMED', amount: 28500 },
    { id: '3', bookingNumber: 'BK250501-003', customerName: 'คุณชนินทร์', vehicleName: 'Streetfighter V4', startDate: '2025-05-02', endDate: '2025-05-07', status: 'ACTIVE', amount: 32000 },
    { id: '4', bookingNumber: 'BK250501-004', customerName: 'คุณกมล', vehicleName: 'Ninja ZX-10R', startDate: '2025-05-03', endDate: '2025-05-06', status: 'COMPLETED', amount: 22000 },
    { id: '5', bookingNumber: 'BK250501-005', customerName: 'คุณธีรพัฒน์', vehicleName: 'CBR1000RR-R', startDate: '2025-05-04', endDate: '2025-05-08', status: 'CANCELLED', amount: 30000 },
  ];

  const recentList = data?.recentBookings?.length > 0 ? data.recentBookings : sampleRecentBookings;

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ภาพรวมระบบเช่ารถ (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ข้อมูลสถิติ รายได้ ยานพาหนะ และการจองสาขากรุงเทพฯ แบบเรียลไทม์
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="/admin/bookings">
            <Button variant="primary" size="sm">
              <CalendarDays className="w-4 h-4 mr-1.5" /> จัดการการจอง
            </Button>
          </Link>
          <Link href="/admin/gps">
            <Button variant="outline" size="sm">
              <Navigation className="w-4 h-4 mr-1.5 text-brand-600" /> แผนที่ GPS สด
            </Button>
          </Link>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          title="รายได้รวม (Total Revenue)"
          value={formatCurrency(kpi.totalRevenue)}
          changeText="↑ 12.5%"
          isPositive={true}
          icon={<DollarSign className="w-5 h-5 text-emerald-600" />}
          iconColorClass="border-emerald-200 bg-emerald-50"
          subtext="จากเดือนที่แล้ว"
        />

        <KpiCard
          title="การจองทั้งหมด (Bookings)"
          value={kpi.totalBookings}
          changeText="↑ 8.2%"
          isPositive={true}
          icon={<CalendarDays className="w-5 h-5 text-brand-600" />}
          iconColorClass="border-brand-200 bg-brand-50"
          subtext="จากเดือนที่แล้ว"
        />

        <KpiCard
          title="รถที่กำลังเช่า (Rented)"
          value={kpi.rentedVehicles}
          changeText="+ 3 คัน"
          isPositive={true}
          icon={<Bike className="w-5 h-5 text-violet-600" />}
          iconColorClass="border-violet-200 bg-violet-50"
          subtext="จากเมื่อวาน"
        />

        <KpiCard
          title="รถว่างพร้อมเช่า (Available)"
          value={kpi.availableVehicles}
          changeText="+ 2 คัน"
          isPositive={true}
          icon={<ShieldCheck className="w-5 h-5 text-sky-600" />}
          iconColorClass="border-sky-200 bg-sky-50"
          subtext="จากเมื่อวาน"
        />

        <KpiCard
          title="ลูกค้าทั้งหมด (Customers)"
          value={kpi.totalCustomers}
          changeText="+ 15 ราย"
          isPositive={true}
          icon={<Users className="w-5 h-5 text-amber-600" />}
          iconColorClass="border-amber-200 bg-amber-50"
          subtext="จากเดือนก่อน"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Smooth Line Chart */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">แนวโน้มรายได้ (Monthly Revenue)</h3>
              <p className="text-xs text-slate-500">รายได้จากการเช่ารถย้อนหลัง 12 เดือน</p>
            </div>
            <span className="text-xs font-bold text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-100">
              ปี 2025
            </span>
          </div>

          <RevenueChart data={data?.monthlyData || []} />
        </Card>

        {/* Booking Status Donut Chart */}
        <Card className="p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">สัดส่วนสถานะการจอง</h3>
            <p className="text-xs text-slate-500">จำแนกตามสถานะปัจจุบันในระบบ</p>
          </div>

          <StatusDonutChart counts={data?.bookingStatusCounts} />
        </Card>
      </div>

      {/* Recent Bookings & Popular Bikes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">รายการจองล่าสุด</h3>
              <p className="text-xs text-slate-500">รายการจอง 5 รายการล่าสุดในระบบ</p>
            </div>
            <Link href="/admin/bookings" className="text-xs text-brand-600 font-bold hover:underline">
              ดูทั้งหมด &gt;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="pb-3">รหัสการจอง</th>
                  <th className="pb-3">ลูกค้า</th>
                  <th className="pb-3">รถที่เช่า</th>
                  <th className="pb-3">ช่วงเวลาเช่า</th>
                  <th className="pb-3">สถานะ</th>
                  <th className="pb-3 text-right">ยอดเงิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {recentList.map((item: any) => {
                  const bNum = item.bookingNumber || `BK250501-00${item.id}`;
                  const cName = item.customerName || (item.customer ? `${item.customer.firstName} ${item.customer.lastName}` : 'ลูกค้า');
                  const vName = item.vehicleName || (item.vehicle ? `${item.vehicle.brand} ${item.vehicle.model}` : 'Big Bike');
                  const sDate = formatDate(item.startDate);
                  const eDate = formatDate(item.endDate);
                  const amt = item.totalAmount || item.amount || 30000;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-900">{bNum}</td>
                      <td className="py-3 font-medium text-slate-800">{cName}</td>
                      <td className="py-3 font-semibold text-slate-900">{vName}</td>
                      <td className="py-3 text-slate-500">{sDate} - {eDate}</td>
                      <td className="py-3">
                        <Badge status={item.status} />
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-900">
                        {formatCurrency(amt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Popular Vehicles Leaderboard */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900">รถยอดนิยม</h3>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">จำนวนครั้งที่เช่า</span>
          </div>

          <div className="space-y-3">
            {[
              { rank: 1, name: 'Ducati Panigale V4S', count: 15, color: 'text-amber-500' },
              { rank: 2, name: 'BMW S 1000 RR', count: 12, color: 'text-slate-400' },
              { rank: 3, name: 'Ducati Streetfighter V4', count: 10, color: 'text-amber-700' },
              { rank: 4, name: 'Kawasaki Ninja ZX-10R', count: 8, color: 'text-slate-500' },
              { rank: 5, name: 'Honda CBR1000RR-R', count: 6, color: 'text-slate-500' },
            ].map((v) => (
              <div key={v.rank} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-none">
                <div className="flex items-center space-x-3">
                  <span className={`font-mono font-bold text-sm w-4 ${v.color}`}>#{v.rank}</span>
                  <span className="font-bold text-slate-800">{v.name}</span>
                </div>
                <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  {v.count} ครั้ง
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
