'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import {
  Users,
  Search,
  Award,
  Calendar,
  Phone,
  Mail,
  Edit2,
  PlusCircle,
  Loader2,
} from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false);
  const [pointsDelta, setPointsDelta] = useState(100);
  const [pointsReason, setPointsReason] = useState('');

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data.customers || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAdjustPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    try {
      await fetch(`/api/customers/${selectedCustomer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pointsAdjustment: pointsDelta,
          reason: pointsReason || 'ปรับแต้มสะสมโดยแอดมิน',
        }),
      });
      setIsPointsModalOpen(false);
      setPointsReason('');
      fetchCustomers();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการปรับแต้ม');
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const term = search.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.phone.toLowerCase().includes(term) ||
      c.user?.email.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">จัดการลูกค้า (Customers CRM)</h1>
          <p className="text-xs text-slate-500 mt-0.5">รายชื่อสมาชิก ระดับสมาชิก แต้มสะสม ประวัติการเช่า และเอกสารยืนยันตัวตน</p>
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
            placeholder="ค้นหาชื่อ, เบอร์โทร, อีเมล..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดรายชื่อลูกค้า...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                  <th className="py-3.5 px-4">ติดต่อ</th>
                  <th className="py-3.5 px-4">ระดับสมาชิก</th>
                  <th className="py-3.5 px-4">แต้มสะสม</th>
                  <th className="py-3.5 px-4">จำนวนการจอง</th>
                  <th className="py-3.5 px-4">วันที่สมัคร</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 font-extrabold flex items-center justify-center border border-brand-100 shrink-0">
                          {customer.firstName.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {customer.firstName} {customer.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400">{customer.user?.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-mono block">{customer.phone}</span>
                      <span className="text-slate-400 text-[10px]">ปชช: {customer.idCardNumber || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className="inline-flex items-center gap-1 font-bold text-[11px] px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${customer.membershipTier?.color || '#94a3b8'}15`,
                          color: customer.membershipTier?.color || '#94a3b8',
                          borderColor: `${customer.membershipTier?.color || '#94a3b8'}30`,
                        }}
                      >
                        <Award className="w-3 h-3" />
                        {customer.membershipTier?.name || 'BRONZE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatNumber(customer.points)} แต้ม
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-semibold">
                      {customer._count?.bookings || 0} รายการ
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(customer.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsPointsModalOpen(true);
                        }}
                      >
                        <PlusCircle className="w-3.5 h-3.5 mr-1" /> ปรับแต้ม
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjust Points Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={isPointsModalOpen}
          onClose={() => setIsPointsModalOpen(false)}
          title={`ปรับปรุงแต้มสะสม: ${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
          maxWidth="md"
        >
          <form onSubmit={handleAdjustPoints} className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500">แต้มปัจจุบัน:</span>
              <span className="font-extrabold text-sm ml-2 text-slate-900">
                {formatNumber(selectedCustomer.points)} แต้ม
              </span>
            </div>

            <Input
              label="จำนวนแต้มที่ต้องการเพิ่ม/ลด (บวกหรือลบ)"
              type="number"
              value={pointsDelta}
              onChange={(e) => setPointsDelta(Number(e.target.value))}
              required
            />

            <div>
              <label className="block font-bold text-slate-700 mb-1">เหตุผลในการปรับปรุงแต้ม</label>
              <textarea
                rows={2}
                value={pointsReason}
                onChange={(e) => setPointsReason(e.target.value)}
                placeholder="เช่น แต้มโบนัสวันเกิด, แก้ไขรายการผิดพลาด"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setIsPointsModalOpen(false)}>
                ยกเลิก
              </Button>
              <Button type="submit" variant="primary">
                บันทึกการปรับแต้ม
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
