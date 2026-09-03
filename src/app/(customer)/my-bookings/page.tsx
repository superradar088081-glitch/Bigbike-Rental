'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarDays, FileText, Bike, ArrowRight, Loader2, Clock } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">การจองของฉัน (My Bookings)</h1>
        <p className="text-sm text-slate-500 mt-1">ประวัติการเช่ารถ สัญญาเช่าดิจิทัล และสถานะการจองปัจจุบัน</p>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-xs text-slate-500">กำลังโหลดรายการการจอง...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">ยังไม่มีประวัติการจองรถ</h3>
          <p className="text-xs text-slate-500">เลือกดูรถบิ๊กไบค์รุ่นที่คุณชื่นชอบและเริ่มจองวันนี้</p>
          <Link href="/vehicles">
            <Button variant="primary" size="md">
              <Bike className="w-4 h-4 mr-2" /> เลือกรถบิ๊กไบค์
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <img
                  src={b.vehicle?.imageUrl}
                  alt={b.vehicle?.model}
                  className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-brand-600">{b.bookingNumber}</span>
                    <Badge status={b.status} />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {b.vehicle?.brand} {b.vehicle?.model}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {formatDate(b.startDate)} - {formatDate(b.endDate)} ({b.totalDays} วัน)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">ยอดชำระแล้ว</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {b.contract && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedContract(b.contract);
                        setIsContractModalOpen(true);
                      }}
                    >
                      <FileText className="w-3.5 h-3.5 mr-1" /> สัญญาเช่า
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Digital Contract Modal */}
      {selectedContract && (
        <Modal
          isOpen={isContractModalOpen}
          onClose={() => setIsContractModalOpen(false)}
          title={`สัญญาเช่าดิจิทัล #${selectedContract.contractNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-slate-300 rounded-xl space-y-3 font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2 text-white font-bold">
                <span>BIG BIKE RENTAL CONTRACT</span>
                <span>{formatDate(selectedContract.contractDate)}</span>
              </div>
              <p className="whitespace-pre-line text-slate-400 leading-relaxed font-sans">
                {selectedContract.terms}
              </p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>สัญญาเช่ามีผลทางกฎหมายสมบูรณ์ ลงนามอิเล็กทรอนิกส์เรียบร้อยแล้ว</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="primary" onClick={() => setIsContractModalOpen(false)}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
