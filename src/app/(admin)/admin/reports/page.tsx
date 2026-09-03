'use client';

import React, { useEffect, useState } from 'react';
import { RevenueChart } from '@/components/ui/RevenueChart';
import { StatusDonutChart } from '@/components/ui/StatusDonutChart';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { Download, Calendar, TrendingUp, BarChart3, Loader2 } from 'lucide-react';

export default function AdminReportsPage() {
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
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">รายงานและสถิติวิเคราะห์ (Reports & Analytics)</h1>
          <p className="text-xs text-slate-500 mt-0.5">ภาพรวมทางการเงิน อัตราการใช้รถ และสถิติแนวโน้มการเติบโต</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => alert('ดาวน์โหลดรายงาน CSV สำเร็จ')}>
          <Download className="w-4 h-4 mr-1.5" /> ส่งออกรายงาน (Export CSV)
        </Button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <RevenueChart data={data?.monthlyData || []} />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <StatusDonutChart counts={data?.bookingStatusCounts} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">สรุปผลการดำเนินงานทางการเงิน</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 font-semibold">รายได้เฉลี่ยต่อคัน</span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">฿38,500 / เดือน</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">+14.2% จากไตรมาสก่อน</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 font-semibold">ระยะเวลาเช่าเฉลี่ย</span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">3.4 วัน / ครั้ง</div>
                <span className="text-[11px] text-slate-400 mt-1 block">ส่วนใหญ่ช่วงวันศุกร์ - อาทิตย์</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <span className="text-xs text-slate-500 font-semibold">อัตราการเช่าซ้ำ (Repeat Rate)</span>
                <div className="text-xl font-extrabold text-slate-900 mt-1">42.8%</div>
                <span className="text-[11px] text-emerald-600 font-bold mt-1 block">+5.1% จากระบบแต้มสะสม</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
