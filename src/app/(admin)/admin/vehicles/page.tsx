'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Bike,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    brand: 'Ducati',
    model: '',
    year: 2024,
    engineCC: 1000,
    licensePlate: '',
    color: 'Red',
    category: 'Super Sport',
    horsepower: 200,
    rentalPricePerDay: 7500,
    depositAmount: 40000,
    imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    description: '',
    status: 'AVAILABLE',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError(null);

      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'เกิดข้อผิดพลาดในการอัปโหลด');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: result.imageUrl,
      }));
    } catch (err: any) {
      setUploadError(err.message || 'ไม่สามารถอัปโหลดรูปภาพได้');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vehicles');
      const data = await res.json();
      setVehicles(data.vehicles || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    try {
      let res;
      if (isEditModalOpen && currentVehicle) {
        res = await fetch(`/api/vehicles/${currentVehicle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลรถ');
      }

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      await fetchVehicles();
      alert(isEditModalOpen ? 'แก้ไขข้อมูลรถสำเร็จแล้ว' : 'เพิ่มรถบิ๊กไบค์ใหม่สำเร็จแล้ว!');
    } catch (err: any) {
      console.error('Save vehicle error:', err);
      setFormError(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลรถ');
      alert(`⚠️ ${err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูลรถ'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: string, modelName: string) => {
    if (!window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบรถ ${modelName} ออกจากระบบ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถลบรถได้');
      }
      alert('ลบข้อมูลรถเรียบร้อยแล้ว');
      fetchVehicles();
    } catch (err: any) {
      alert(`⚠️ ${err.message || 'เกิดข้อผิดพลาดในการลบรถ'}`);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/vehicles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchVehicles();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchSearch =
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(search.toLowerCase());
    const matchBrand = brandFilter === 'ALL' || v.brand.toUpperCase() === brandFilter.toUpperCase();
    const matchStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchSearch && matchBrand && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">จัดการรถบิ๊กไบค์ (Vehicles)</h1>
          <p className="text-xs text-slate-500 mt-0.5">รายการรถทั้งหมดในกองยาน สเปก ราคา และสถานะการใช้งาน</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setFormError(null);
            setFormData({
              brand: 'Ducati',
              model: '',
              year: 2024,
              engineCC: 1000,
              licensePlate: '',
              color: 'Red',
              category: 'Super Sport',
              horsepower: 200,
              rentalPricePerDay: 7500,
              depositAmount: 40000,
              imageUrl: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
              description: '',
              status: 'AVAILABLE',
            });
            setIsAddModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1.5" /> เพิ่มรถใหม่
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหายี่ห้อ, รุ่น, ทะเบียนรถ..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Brand Filter */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">ทุกยี่ห้อ</option>
            <option value="Ducati">Ducati</option>
            <option value="BMW">BMW</option>
            <option value="Yamaha">Yamaha</option>
            <option value="Kawasaki">Kawasaki</option>
            <option value="Honda">Honda</option>
            <option value="Triumph">Triumph</option>
            <option value="Suzuki">Suzuki</option>
            <option value="Harley-Davidson">Harley-Davidson</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="AVAILABLE">พร้อมให้เช่า (Available)</option>
            <option value="RENTED">กำลังเช่า (Rented)</option>
            <option value="RESERVED">จองแล้ว (Reserved)</option>
            <option value="MAINTENANCE">ซ่อมบำรุง (Maintenance)</option>
            <option value="INACTIVE">ปิดใช้งาน (Inactive)</option>
          </select>
        </div>
      </div>

      {/* Vehicles Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-xs text-slate-500">กำลังโหลดรายการรถ...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="py-3.5 px-4">รูปรถ & รุ่น</th>
                  <th className="py-3.5 px-4">ทะเบียนรถ</th>
                  <th className="py-3.5 px-4">เครื่องยนต์ / ปี</th>
                  <th className="py-3.5 px-4">ราคาเช่า / มัดจำ</th>
                  <th className="py-3.5 px-4">เลขไมล์</th>
                  <th className="py-3.5 px-4">สถานะ</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={vehicle.imageUrl}
                          alt={vehicle.model}
                          className="w-14 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <span className="font-extrabold text-sm text-slate-900 block">
                            {vehicle.brand} {vehicle.model}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">{vehicle.category} • {vehicle.color}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <span className="bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {vehicle.licensePlate}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-bold text-slate-800">{vehicle.engineCC} CC</span>
                      <span className="text-slate-400 block text-[10px]">ปี {vehicle.year} • {vehicle.horsepower || 200} HP</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-brand-600 block">{formatCurrency(vehicle.rentalPricePerDay)}/วัน</span>
                      <span className="text-[10px] text-slate-400">มัดจำ {formatCurrency(vehicle.depositAmount)}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      {formatNumber(vehicle.mileage)} km
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={vehicle.status}
                        onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                        className="text-[11px] font-semibold rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none"
                      >
                        <option value="AVAILABLE">🟢 พร้อมให้เช่า</option>
                        <option value="RENTED">🔵 กำลังเช่า</option>
                        <option value="RESERVED">🟡 จองแล้ว</option>
                        <option value="MAINTENANCE">🟠 ซ่อมบำรุง</option>
                        <option value="INACTIVE">⚪ ปิดใช้งาน</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setFormError(null);
                            setCurrentVehicle(vehicle);
                            setFormData({
                              brand: vehicle.brand,
                              model: vehicle.model,
                              year: vehicle.year,
                              engineCC: vehicle.engineCC,
                              licensePlate: vehicle.licensePlate,
                              color: vehicle.color,
                              category: vehicle.category,
                              horsepower: vehicle.horsepower || 200,
                              rentalPricePerDay: vehicle.rentalPricePerDay,
                              depositAmount: vehicle.depositAmount,
                              imageUrl: vehicle.imageUrl,
                              description: vehicle.description || '',
                              status: vehicle.status,
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(vehicle.id, `${vehicle.brand} ${vehicle.model}`)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setFormError(null);
        }}
        title={isEditModalOpen ? 'แก้ไขข้อมูลรถบิ๊กไบค์' : 'เพิ่มรถบิ๊กไบค์ใหม่เข้าระบบ'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveVehicle} className="space-y-4 text-xs">
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                ยี่ห้อ (Brand) *
              </label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500"
                required
              >
                <option value="Ducati">Ducati</option>
                <option value="BMW">BMW</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Kawasaki">Kawasaki</option>
                <option value="Honda">Honda</option>
                <option value="Triumph">Triumph</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Harley-Davidson">Harley-Davidson</option>
                <option value="KTM">KTM</option>
                <option value="Aprilia">Aprilia</option>
              </select>
            </div>
            <Input
              label="รุ่น (Model) *"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="เช่น Panigale V4S, S 1000 RR"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="ทะเบียนรถ (License Plate) *"
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
              placeholder="เช่น 1กพ 1234"
              required
            />
            <Input
              label="ขนาดเครื่องยนต์ (CC) *"
              type="number"
              value={formData.engineCC}
              onChange={(e) => setFormData({ ...formData, engineCC: Number(e.target.value) })}
              required
            />
            <Input
              label="ปีที่ผลิต (Year) *"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                ประเภทรถ (Category) *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500"
                required
              >
                <option value="Super Sport">Super Sport</option>
                <option value="Naked Roadster">Naked Roadster</option>
                <option value="Touring Adventure">Touring Adventure</option>
                <option value="Cruiser">Cruiser</option>
                <option value="Hyper Sport">Hyper Sport</option>
                <option value="Modern Classic">Modern Classic</option>
                <option value="Scooter">Scooter</option>
              </select>
            </div>
            <Input
              label="สีของรถ (Color) *"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="เช่น Red, Vivid Black"
              required
            />
            <Input
              label="แรงม้า (Horsepower HP)"
              type="number"
              value={formData.horsepower}
              onChange={(e) => setFormData({ ...formData, horsepower: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ราคาเช่าต่อวัน (THB/Day) *"
              type="number"
              value={formData.rentalPricePerDay}
              onChange={(e) => setFormData({ ...formData, rentalPricePerDay: Number(e.target.value) })}
              required
            />
            <Input
              label="เงินมัดจำ (Deposit THB) *"
              type="number"
              value={formData.depositAmount}
              onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
              คำอธิบายรายละเอียดรถ (Description)
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="รายละเอียดสเปกรถ จุดเด่น อุปกรณ์ตกแต่ง..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* IMAGE UPLOAD & PREVIEW */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase text-slate-700">
              รูปภาพรถบิ๊กไบค์ (Vehicle Image) *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
              {/* Image Preview Box */}
              <div className="sm:col-span-4 bg-slate-100 border border-slate-200 rounded-2xl overflow-hidden aspect-video flex items-center justify-center relative group">
                {formData.imageUrl ? (
                  <>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium pointer-events-none">
                      รูปภาพปัจจุบัน
                    </div>
                  </>
                ) : (
                  <div className="text-center p-3 text-slate-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                    <span className="text-[11px]">ไม่มีรูปภาพ</span>
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <label className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-xl cursor-pointer font-medium text-xs transition-colors shadow-xs">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
                        <span>กำลังอัปโหลดรูปภาพ...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-brand-600" />
                        <span>เลือกรูปภาพจากเครื่องคอมพิวเตอร์</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/jpg"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1">
                    รองรับไฟล์ JPG, PNG, WEBP (ขนาดไม่เกิน 10MB)
                  </p>
                </div>

                {uploadError && (
                  <p className="text-xs text-rose-600 font-medium">⚠️ {uploadError}</p>
                )}

                <div className="relative">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    หรือระบุ URL รูปภาพโดยตรง
                  </span>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... หรือ /uploads/..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500 font-mono"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setFormError(null);
              }}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
