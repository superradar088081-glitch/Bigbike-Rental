'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { AlertOctagon, Plus, Search, Eye, Loader2 } from 'lucide-react';

export default function AdminDamagesPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New report state
  const [formData, setFormData] = useState({
    vehicleId: '',
    description: '',
    estimatedCost: 2000,
    actualCost: 2000,
    deductionFromDeposit: 2000,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resReports, resVehicles] = await Promise.all([
        fetch('/api/damages').then((r) => r.json()),
        fetch('/api/vehicles').then((r) => r.json()),
      ]);
      setReports(resReports.reports || []);
      setVehicles(resVehicles.vehicles || []);
      if (resVehicles.vehicles?.length > 0) {
        setFormData((prev) => ({ ...prev, vehicleId: resVehicles.vehicles[0].id }));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/damages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsCreateModalOpen(false);
      setFormData({
        vehicleId: vehicles[0]?.id || '',
        description: '',
        estimatedCost: 2000,
        actualCost: 2000,
        deductionFromDeposit: 2000,
      });
      fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกรายงาน');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">รายงานความเสียหาย (Damage Reports)</h1>
          <p className="text-xs text-slate-500 mt-0.5">บันทึกรอยขีดข่วน อุบัติเหตุ ค่าประเมินซ่อม และการหักเงินมัดจำของลูกค้า</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> บันทึกความเสียหายใหม่
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดรายการความเสียหาย...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">รถที่เกิดเหตุ</th>
                  <th className="py-3.5 px-4">รหัสการจอง / ผู้เช่า</th>
                  <th className="py-3.5 px-4">รายละเอียดความเสียหาย</th>
                  <th className="py-3.5 px-4">ค่าเสียหายประเมิน</th>
                  <th className="py-3.5 px-4">หักจากมัดจำ</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">วันที่บันทึก</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {report.vehicle?.brand} {report.vehicle?.model}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{report.vehicle?.licensePlate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-800 block">
                        {report.booking?.bookingNumber || 'นอกรอบการเช่า'}
                      </span>
                      {report.booking?.customer && (
                        <span className="text-[10px] text-slate-400">
                          {report.booking.customer.firstName} {report.booking.customer.lastName}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                      {report.description}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(report.estimatedCost)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-rose-600">
                      {formatCurrency(report.deductionFromDeposit)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {formatDate(report.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Damage Report Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="บันทึกรายงานความเสียหายใหม่"
        maxWidth="md"
      >
        <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">เลือกรถที่มีความเสียหาย</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} ({v.licensePlate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">รายละเอียดความเสียหาย</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="ระบุจุดที่เกิดรอย หรือชิ้นส่วนที่แตกหัก..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ค่าเสียหายประเมิน (THB)"
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
              required
            />
            <Input
              label="หักจากเงินมัดจำ (THB)"
              type="number"
              value={formData.deductionFromDeposit}
              onChange={(e) => setFormData({ ...formData, deductionFromDeposit: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary">
              บันทึกรายงาน
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
