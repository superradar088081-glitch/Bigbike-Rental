'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { CreditCard, Search, CheckCircle2, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/payments')
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPayments = payments.filter((p) => {
    const term = search.toLowerCase();
    return (
      (p.transactionId && p.transactionId.toLowerCase().includes(term)) ||
      (p.booking?.bookingNumber && p.booking.bookingNumber.toLowerCase().includes(term)) ||
      (p.booking?.customer?.firstName && p.booking.customer.firstName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">บันทึกธุรกรรมการชำระเงิน (Payments)</h1>
          <p className="text-xs text-slate-500 mt-0.5">ประวัติการชำระค่าเช่า เงินมัดจำ การคืนเงิน และการหักค่าเสียหาย</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหารหัสธุรกรรม, รหัสการจอง, ชื่อผู้ชำระ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดรายการชำระเงิน...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">รหัสธุรกรรม</th>
                  <th className="py-3.5 px-4">รหัสการจอง</th>
                  <th className="py-3.5 px-4">ลูกค้า & รถ</th>
                  <th className="py-3.5 px-4">ประเภท</th>
                  <th className="py-3.5 px-4">ช่องทาง</th>
                  <th className="py-3.5 px-4">จำนวนเงิน</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">เวลาที่ทำรายการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isRefund = p.paymentType === 'REFUND';
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {p.transactionId || `TXN-${p.id.slice(0, 8)}`}
                      </td>
                      <td className="py-3 px-4 font-mono text-brand-600 font-bold">
                        {p.booking?.bookingNumber}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 block">
                          {p.booking?.customer?.firstName} {p.booking?.customer?.lastName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {p.booking?.vehicle?.brand} {p.booking?.vehicle?.model}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        <span className="flex items-center gap-1">
                          {isRefund ? (
                            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-500" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          {p.paymentType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-bold text-slate-700">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-extrabold text-slate-900">
                        <span className={isRefund ? 'text-rose-600' : 'text-emerald-600'}>
                          {isRefund ? '-' : '+'}{formatCurrency(p.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={p.status} />
                      </td>
                      <td className="py-3 px-4 text-right text-slate-500 font-mono">
                        {formatDateTime(p.paidAt || p.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
