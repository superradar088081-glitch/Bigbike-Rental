'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { Wrench, Plus, CheckCircle, Clock, Loader2 } from 'lucide-react';

export default function AdminMaintenancePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Maintenance Form
  const [formData, setFormData] = useState({
    vehicleId: '',
    maintenanceType: 'เปลี่ยนถ่ายน้ำมันเครื่อง & ไส้กรอง',
    description: 'Service เช็คระยะตามรอบ',
    cost: 3500,
    mileage: 10000,
    serviceDate: new Date().toISOString().slice(0, 10),
    status: 'SCHEDULED',
    performedBy: 'Bangkok Superbike Official',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resLogs, resVehicles] = await Promise.all([
        fetch('/api/maintenance').then((r) => r.json()),
        fetch('/api/vehicles').then((r) => r.json()),
      ]);
      setLogs(resLogs.logs || []);
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

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการบันทึกซ่อมบำรุง');
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">ตารางการซ่อมบำรุง (Maintenance)</h1>
          <p className="text-xs text-slate-500 mt-0.5">บันทึกการเช็คระยะ ถ่ายน้ำมันเครื่อง เปลี่ยนยาง และประวัติค่าใช้จ่ายซ่อมบำรุง</p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" /> นัดหมายซ่อมบำรุงใหม่
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดข้อมูลซ่อมบำรุง...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">รถที่เข้ารับบริการ</th>
                  <th className="py-3.5 px-4">ประเภทงานซ่อม</th>
                  <th className="py-3.5 px-4">รายละเอียด</th>
                  <th className="py-3.5 px-4">ค่าใช้จ่าย</th>
                  <th className="py-3.5 px-4">เลขไมล์</th>
                  <th className="py-3.5 px-4">วันที่ทำรายการ</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">
                        {log.vehicle?.brand} {log.vehicle?.model}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{log.vehicle?.licensePlate}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{log.maintenanceType}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.description}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(log.cost)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {formatNumber(log.mileage)} km
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(log.serviceDate)}</td>
                    <td className="py-3 px-4">
                      <Badge status={log.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      {log.status !== 'COMPLETED' && (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleUpdateStatus(log.id, 'COMPLETED')}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" /> เสร็จสิ้น
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="บันทึกการซ่อมบำรุง / เช็คระยะ"
        maxWidth="md"
      >
        <form onSubmit={handleCreateMaintenance} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">เลือกรถบิ๊กไบค์</label>
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

          <Input
            label="ประเภทงานซ่อม / เช็คระยะ"
            value={formData.maintenanceType}
            onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
            required
          />

          <div>
            <label className="block font-bold text-slate-700 mb-1">รายละเอียดงานที่ทำ</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ค่าใช้จ่าย (THB)"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
              required
            />
            <Input
              label="เลขไมล์ขณะเข้าบริการ (KM)"
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary">
              บันทึกรายการ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
