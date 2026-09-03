'use client';

import React, { useEffect, useState } from 'react';
import { GpsInteractiveMap, GpsVehicleItem } from '@/components/ui/GpsInteractiveMap';
import { Loader2, RefreshCw, ShieldAlert, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminGpsPage() {
  const [fleet, setFleet] = useState<GpsVehicleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGps = async () => {
    try {
      const res = await fetch('/api/gps');
      const data = await res.json();
      setFleet(data.fleet || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGps();
    // Auto-refresh GPS telemetry every 10 seconds
    const interval = setInterval(fetchGps, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">ระบบติดตาม GPS & Geofence</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามตำแหน่งรถบิ๊กไบค์แบบเรียลไทม์ ความเร็ว สถานะแบตเตอรี่ และแจ้งเตือนเมื่อขับออกนอกพื้นที่อนุญาต
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={fetchGps}>
          <RefreshCw className="w-4 h-4 mr-1.5" /> อัปเดตพิกัดทันที
        </Button>
      </div>

      {/* GPS Interactive Map & Fleet Telemetry Component */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
          <p className="text-xs text-slate-500">กำลังเชื่อมต่อดาวเทียม GPS และโหลดพิกัดรถ...</p>
        </div>
      ) : (
        <GpsInteractiveMap fleet={fleet} />
      )}
    </div>
  );
}
