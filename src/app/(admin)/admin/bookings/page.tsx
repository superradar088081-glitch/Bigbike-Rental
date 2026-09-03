'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import {
  CalendarDays,
  Search,
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
  Eye,
  FileText,
  Loader2,
  AlertOctagon,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Check-in Damage state
  const [damageCost, setDamageCost] = useState(0);
  const [damageDesc, setDamageDesc] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
      setIsDetailModalOpen(false);
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  };

  const handleCheckInComplete = async () => {
    if (!selectedBooking) return;
    try {
      if (damageCost > 0) {
        // Record damage report
        await fetch('/api/damages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: selectedBooking.id,
            vehicleId: selectedBooking.vehicleId,
            description: damageDesc || 'พบความเสียหายขณะตรวจรับรถคืน',
            estimatedCost: damageCost,
            actualCost: damageCost,
            deductionFromDeposit: damageCost,
          }),
        });
      }

      // Complete booking
      await fetch(`/api/bookings/${selectedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' }),
      });

      setIsCheckInModalOpen(false);
      setDamageCost(0);
      setDamageDesc('');
      fetchBookings();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกการรับรถคืน');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.bookingNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.firstName.toLowerCase().includes(search.toLowerCase()) ||
      b.customer?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.model.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">จัดการการจองรถ (Bookings)</h1>
          <p className="text-xs text-slate-500 mt-0.5">อนุมัติการจอง ส่งมอบรถ (Check-out) รับรถคืน (Check-in) และสัญญาเช่า</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหารหัสจอง, ชื่อลูกค้า, รุ่นรถ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
        >
          <option value="ALL">ทุกสถานะการจอง</option>
          <option value="PENDING">🟡 รอดำเนินการ (Pending)</option>
          <option value="CONFIRMED">🔵 อนุมัติแล้ว (Confirmed)</option>
          <option value="ACTIVE">🟣 กำลังใช้งาน / รับรถแล้ว (Active)</option>
          <option value="COMPLETED">🟢 เสร็จสิ้น (Completed)</option>
          <option value="CANCELLED">🔴 ยกเลิก (Cancelled)</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดรายการจอง...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">รหัสจอง</th>
                  <th className="py-3.5 px-4">ลูกค้า</th>
                  <th className="py-3.5 px-4">รถที่เช่า</th>
                  <th className="py-3.5 px-4">ระยะเวลาเช่า</th>
                  <th className="py-3.5 px-4">ยอดรวม / มัดจำ</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {booking.bookingNumber}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {booking.customer?.firstName} {booking.customer?.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400">{booking.customer?.phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{booking.vehicle?.licensePlate}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                      <span className="text-slate-400 block text-[10px]">({booking.totalDays} วัน)</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{formatCurrency(booking.totalAmount)}</span>
                      <span className="text-[10px] text-slate-400">มัดจำ {formatCurrency(booking.depositAmount)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge status={booking.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick action buttons according to status */}
                        {booking.status === 'PENDING' && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
                            title="อนุมัติการจอง"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> อนุมัติ
                          </Button>
                        )}

                        {booking.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleStatusUpdate(booking.id, 'ACTIVE')}
                            title="ส่งมอบรถ (Check-out)"
                          >
                            <Play className="w-3.5 h-3.5" /> ส่งมอบรถ
                          </Button>
                        )}

                        {booking.status === 'ACTIVE' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setIsCheckInModalOpen(true);
                            }}
                            title="รับรถคืน & ตรวจสภาพ (Check-in)"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> รับรถคืน
                          </Button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="ดูรายละเอียด & สัญญา"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Detail & Contract Modal */}
      {selectedBooking && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`รายละเอียดการจอง #${selectedBooking.bookingNumber}`}
          maxWidth="2xl"
        >
          <div className="space-y-6 text-xs">
            {/* Status Header */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] uppercase font-bold">สถานะปัจจุบัน</span>
                <div className="mt-1">
                  <Badge status={selectedBooking.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] uppercase font-bold">ยอดชำระรวม</span>
                <div className="text-base font-extrabold text-brand-600">
                  {formatCurrency(selectedBooking.totalAmount)}
                </div>
              </div>
            </div>

            {/* Customer & Vehicle specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">ข้อมูลผู้เช่า</h4>
                <p className="font-bold">{selectedBooking.customer?.firstName} {selectedBooking.customer?.lastName}</p>
                <p className="text-slate-500">โทร: {selectedBooking.customer?.phone}</p>
                <p className="text-slate-500">เลขบัตร ปชช: {selectedBooking.customer?.idCardNumber || '-'}</p>
                <p className="text-slate-500">ใบขับขี่: {selectedBooking.customer?.driverLicenseNumber || '-'}</p>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">ข้อมูลรถบิ๊กไบค์</h4>
                <p className="font-bold">{selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.model}</p>
                <p className="text-slate-500 font-mono">ทะเบียน: {selectedBooking.vehicle?.licensePlate}</p>
                <p className="text-slate-500">เครื่องยนต์: {selectedBooking.vehicle?.engineCC} CC</p>
                <p className="text-slate-500">เงินมัดจำ: {formatCurrency(selectedBooking.depositAmount)}</p>
              </div>
            </div>

            {/* Rental Contract details */}
            <div className="p-4 bg-slate-900 text-slate-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-white font-bold">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-500" /> สัญญาเช่าดิจิทัล (Digital Contract)
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {selectedBooking.contract?.contractNumber || 'CTR-DRAFT'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-pre-line leading-relaxed">
                {selectedBooking.contract?.terms || 'สัญญาเช่ารถจักรยานยนต์บิ๊กไบค์มาตรฐาน'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              {selectedBooking.status === 'PENDING' && (
                <Button variant="danger" size="sm" onClick={() => handleStatusUpdate(selectedBooking.id, 'REJECTED')}>
                  <XCircle className="w-4 h-4 mr-1" /> ปฏิเสธการจอง
                </Button>
              )}
              {selectedBooking.status === 'PENDING' && (
                <Button variant="success" size="sm" onClick={() => handleStatusUpdate(selectedBooking.id, 'CONFIRMED')}>
                  <CheckCircle className="w-4 h-4 mr-1" /> อนุมัติการจอง
                </Button>
              )}
              {selectedBooking.status === 'CONFIRMED' && (
                <Button variant="primary" size="sm" onClick={() => handleStatusUpdate(selectedBooking.id, 'ACTIVE')}>
                  <Play className="w-4 h-4 mr-1" /> ส่งมอบรถ (Check-out)
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Check-In / Return & Damage Inspection Modal */}
      {selectedBooking && (
        <Modal
          isOpen={isCheckInModalOpen}
          onClose={() => setIsCheckInModalOpen(false)}
          title={`รับรถคืน & ตรวจสภาพ (Check-in) #${selectedBooking.bookingNumber}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
              <span className="font-bold block">การตรวจสอบสภาพรถหลังคืน</span>
              <p className="text-[11px] mt-0.5">
                กรุณาตรวจสอบรอยขีดข่วน ระดับน้ำมันเชื้อเพลิง และสภาพยาง หากพบความเสียหายให้ระบุจำนวนเงินเพื่อหักจากเงินมัดจำ {formatCurrency(selectedBooking.depositAmount)}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">ค่าเสียหาย / ค่าปรับ (THB)</label>
              <input
                type="number"
                value={damageCost}
                onChange={(e) => setDamageCost(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-900 focus:outline-none focus:border-brand-500"
              />
            </div>

            {damageCost > 0 && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">รายละเอียดความเสียหาย</label>
                <textarea
                  rows={2}
                  value={damageDesc}
                  onChange={(e) => setDamageDesc(e.target.value)}
                  placeholder="เช่น รอยครูดท่อไอเสียด้านขวา, คืนรถล่าช้า 2 ชม."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                />
                <p className="text-rose-600 font-bold text-[11px] mt-1">
                  เงินมัดจำที่จะคืนลูกค้าสุทธิ: {formatCurrency(Math.max(0, selectedBooking.depositAmount - damageCost))}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsCheckInModalOpen(false)}>
                ยกเลิก
              </Button>
              <Button variant="primary" onClick={handleCheckInComplete}>
                ยืนยันการรับรถคืน & คืนมัดจำ
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
