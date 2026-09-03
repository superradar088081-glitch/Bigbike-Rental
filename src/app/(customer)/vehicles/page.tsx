'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Bike,
  Gauge,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Loader2,
} from 'lucide-react';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('popular');
  const [ccRange, setCcRange] = useState('ALL');

  const brands = [
    'ALL',
    'Ducati',
    'BMW',
    'Yamaha',
    'Kawasaki',
    'Honda',
    'Suzuki',
    'Harley-Davidson',
    'Triumph',
  ];

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      let query = `/api/vehicles?sortBy=${sortBy}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      if (selectedBrand !== 'ALL') query += `&brand=${encodeURIComponent(selectedBrand)}`;
      if (selectedCategory !== 'ALL') query += `&category=${encodeURIComponent(selectedCategory)}`;
      if (selectedStatus !== 'ALL') query += `&status=${encodeURIComponent(selectedStatus)}`;

      const res = await fetch(query);
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
  }, [selectedBrand, selectedCategory, selectedStatus, sortBy]);

  const filteredVehicles = vehicles.filter((v) => {
    if (ccRange === 'UNDER_1000') return v.engineCC < 1000;
    if (ccRange === 'OVER_1000') return v.engineCC >= 1000;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
          PREMIUM BIG BIKE FLEET
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          เลือกรถบิ๊กไบค์สำหรับทริปของคุณ
        </h1>
        <p className="text-sm text-slate-500">
          รถทุกคันผ่านการตรวจเช็คสภาพตามมาตรฐานศูนย์ ประกันภัยชั้น 1 พร้อมอุปกรณ์ความปลอดภัยครบชุด
        </p>
      </div>

      {/* Brand Pills */}
      <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2">
        {brands.map((b) => (
          <button
            key={b}
            onClick={() => setSelectedBrand(b)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedBrand === b
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {b === 'ALL' ? 'ทุกยี่ห้อ (All Brands)' : b}
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหารุ่น, ยี่ห้อ, หรือทะเบียน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchVehicles()}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* CC Range */}
          <select
            value={ccRange}
            onChange={(e) => setCcRange(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">ขนาดเครื่องยนต์ (CC)</option>
            <option value="UNDER_1000">ต่ำกว่า 1,000 CC</option>
            <option value="OVER_1000">1,000 CC ขึ้นไป</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">สถานะทั้งหมด</option>
            <option value="AVAILABLE">ว่างพร้อมเช่า</option>
            <option value="RENTED">กำลังให้เช่า</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none"
          >
            <option value="popular">เรียงตาม: ยอดนิยม</option>
            <option value="price_asc">ราคา: ต่ำไปสูง</option>
            <option value="price_desc">ราคา: สูงไปต่ำ</option>
            <option value="newest">ปีรถ: ใหม่ล่าสุด</option>
          </select>
        </div>
      </div>

      {/* Vehicles Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-xs text-slate-500">กำลังโหลดรถบิ๊กไบค์...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <Bike className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">ไม่พบรถบิ๊กไบค์ที่ตรงกับเงื่อนไข</h3>
          <p className="text-xs text-slate-500">ลองปรับเปลี่ยนคำค้นหาหรือรีเซ็ตตัวกรอง</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setSelectedBrand('ALL');
              setSelectedCategory('ALL');
              setSelectedStatus('ALL');
              setCcRange('ALL');
            }}
          >
            ล้างตัวกรองทั้งหมด
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((bike) => (
            <div
              key={bike.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <img
                  src={bike.imageUrl}
                  alt={`${bike.brand} ${bike.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <Badge status={bike.status} />
                </div>
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-mono font-bold backdrop-blur-md">
                  {bike.engineCC} CC
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {bike.brand}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5 group-hover:text-brand-600 transition-colors">
                    {bike.model} ({bike.year})
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">แรงม้า</span>
                    <span className="font-bold text-slate-800">{bike.horsepower} HP</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">เกียร์</span>
                    <span className="font-bold text-slate-800">6 Speed</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">เงินมัดจำ</span>
                    <span className="font-bold text-slate-800 font-mono">
                      {formatCurrency(bike.depositAmount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs text-slate-400 block">ราคาเช่าเริ่มต้น</span>
                    <span className="text-2xl font-extrabold text-brand-600 font-mono">
                      {formatCurrency(bike.rentalPricePerDay)}
                    </span>
                    <span className="text-xs text-slate-500"> / วัน</span>
                  </div>

                  <Link href={`/vehicles/${bike.id}`}>
                    <Button variant="primary" size="md">
                      จองรถคันนี้
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
