'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatNumber, formatDate } from '@/lib/utils';
import {
  Navigation,
  Battery,
  Gauge,
  MapPin,
  AlertTriangle,
  Radio,
  Clock,
  User,
  Phone,
  ShieldCheck,
  Bike,
  Layers,
  Maximize2,
  Compass,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export interface GpsVehicleItem {
  id: string;
  deviceSerial: string;
  batteryLevel: number;
  status: string;
  lastSeenAt: string | Date;
  vehicle: {
    id: string;
    brand: string;
    model: string;
    licensePlate: string;
    imageUrl: string;
    status: string;
  };
  currentRenter?: {
    name: string;
    phone: string;
    bookingNumber: string;
  } | null;
  latestLocation: {
    latitude: number;
    longitude: number;
    speed: number;
    heading?: number;
    isOutOfZone: boolean;
    recordedAt: string | Date;
  } | null;
}

export interface GpsInteractiveMapProps {
  fleet: GpsVehicleItem[];
}

export const GpsInteractiveMap: React.FC<GpsInteractiveMapProps> = ({ fleet }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    fleet.length > 0 ? fleet[0].id : null
  );
  const [mapType, setMapType] = useState<'dark' | 'voyager' | 'osm'>('dark');
  const [mapReady, setMapReady] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});
  const geofenceCircleRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const selectedVehicle = fleet.find((v) => v.id === selectedVehicleId) || fleet[0];

  // Tile layers configuration
  const tileUrls = {
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!mapContainerRef.current || mapInstanceRef.current) return;

      const L = (await import('leaflet')).default;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!isMounted) return;

      // Center around Bangkok HQ (Sukhumvit 71: 13.7165, 100.5930)
      const map = L.map(mapContainerRef.current, {
        center: [13.7563, 100.5018],
        zoom: 12,
        zoomControl: false,
      });

      // Add Zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add Tile Layer
      tileLayerRef.current = L.tileLayer(tileUrls[mapType], {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add HQ Pin (Sukhumvit 71 HQ)
      const hqIcon = L.divIcon({
        className: 'custom-hq-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px;">
            <div style="position: absolute; inset: 0; background: rgba(14, 165, 233, 0.3); border-radius: 9999px; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position: relative; width: 36px; height: 36px; background: #0284c7; border: 2px solid #ffffff; border-radius: 9999px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
              HQ
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const hqMarker = L.marker([13.7165, 100.593], { icon: hqIcon }).addTo(map);
      hqMarker.bindPopup(`
        <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; line-height: 1.4;">
          <strong style="font-size: 13px; color: #0284c7;">🏢 ศูนย์กลางสาขาใหญ่ BKK (สุขุมวิท 71)</strong><br/>
          <span>จุดกระจายรถและศูนย์ควบคุมความปลอดภัย</span>
        </div>
      `);

      // Add Geofence Safe Radius (50km from HQ)
      geofenceCircleRef.current = L.circle([13.7165, 100.593], {
        radius: 35000, // 35km radius safe zone
        color: '#e11d48',
        weight: 1.5,
        opacity: 0.6,
        fillColor: '#e11d48',
        fillOpacity: 0.04,
        dashArray: '6, 8',
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);

      // Force recalculate dimensions to prevent missing tile squares
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when mapType changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(tileUrls[mapType]);
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
  }, [mapType]);

  // Update Markers for Fleet
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;

    import('leaflet').then((LModule) => {
      const L = LModule.default;
      const map = mapInstanceRef.current;

      // Remove existing markers
      Object.values(markersRef.current).forEach((marker: any) => {
        map.removeLayer(marker);
      });
      markersRef.current = {};

      const latLngs: any[] = [];

      fleet.forEach((item) => {
        const lat = item.latestLocation?.latitude || 13.7563;
        const lng = item.latestLocation?.longitude || 100.5018;
        const isAlert = item.latestLocation?.isOutOfZone;
        const isSelected = item.id === selectedVehicleId;
        const speed = item.latestLocation?.speed || 0;

        latLngs.push([lat, lng]);

        const markerHtml = `
          <div style="position: relative; width: 44px; height: 44px; cursor: pointer;">
            <!-- Pulse ripple -->
            <div style="
              position: absolute;
              inset: -4px;
              background: ${isAlert ? 'rgba(225, 29, 72, 0.4)' : isSelected ? 'rgba(225, 29, 72, 0.35)' : 'rgba(16, 185, 129, 0.25)'};
              border-radius: 9999px;
              animation: ${isAlert ? 'ping 1s cubic-bezier(0,0,0.2,1) infinite' : isSelected ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none'};
            "></div>

            <!-- Pin circle -->
            <div style="
              position: relative;
              width: 38px;
              height: 38px;
              background: ${isAlert ? '#e11d48' : isSelected ? '#e11d48' : '#0f172a'};
              border: 2.5px solid ${isAlert ? '#ffffff' : isSelected ? '#ffffff' : '#38bdf8'};
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5"/>
                <circle cx="5.5" cy="17.5" r="3.5"/>
                <circle cx="15" cy="5" r="1"/>
                <path d="M12 17.5V14l-3-3 4-3 2 3h2"/>
              </svg>
            </div>

            <!-- Speed Badge -->
            <div style="
              position: absolute;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
              background: #0f172a;
              color: #f8fafc;
              border: 1px solid #334155;
              border-radius: 9999px;
              padding: 1px 6px;
              font-size: 9px;
              font-weight: bold;
              white-space: nowrap;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">
              ${speed} km/h
            </div>
          </div>
        `;

        const icon = L.divIcon({
          className: 'custom-vehicle-pin',
          html: markerHtml,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
        });

        const marker = L.marker([lat, lng], { icon, zIndexOffset: isSelected ? 1000 : 100 }).addTo(map);

        marker.bindPopup(`
          <div style="color: #0f172a; font-family: sans-serif; font-size: 12px; line-height: 1.5; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              <img src="${item.vehicle.imageUrl}" style="width: 40px; height: 28px; object-fit: cover; border-radius: 6px; border: 1px solid #cbd5e1;" />
              <div>
                <strong style="font-size: 12px; color: #0f172a; display: block;">${item.vehicle.brand} ${item.vehicle.model}</strong>
                <span style="font-size: 10px; color: #64748b; font-family: monospace;">ทะเบียน: ${item.vehicle.licensePlate}</span>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 6px;">
              <div>⚡ ความเร็ว: <strong>${speed} km/h</strong></div>
              <div>🔋 แบต: <strong>${item.batteryLevel}%</strong></div>
            </div>
            <div style="font-size: 11px; color: #334155;">
              👤 ผู้เช่า: <strong>${item.currentRenter?.name || 'ไม่มี (จอดศูนย์)'}</strong>
            </div>
            ${item.currentRenter?.phone ? `
              <div style="margin-top: 6px;">
                <a href="tel:${item.currentRenter.phone}" style="display: block; text-align: center; background: #e11d48; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 10px;">
                  📞 โทรหาผู้เช่า (${item.currentRenter.phone})
                </a>
              </div>
            ` : ''}
          </div>
        `);

        marker.on('click', () => {
          setSelectedVehicleId(item.id);
        });

        markersRef.current[item.id] = marker;
      });
    });
  }, [fleet, selectedVehicleId, mapReady]);

  // Pan to selected vehicle
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVehicle) return;

    const lat = selectedVehicle.latestLocation?.latitude || 13.7563;
    const lng = selectedVehicle.latestLocation?.longitude || 100.5018;

    mapInstanceRef.current.flyTo([lat, lng], 14, {
      duration: 1.2,
    });

    if (markersRef.current[selectedVehicle.id]) {
      markersRef.current[selectedVehicle.id].openPopup();
    }
  }, [selectedVehicleId]);

  const handleCenterAll = () => {
    if (!mapInstanceRef.current || fleet.length === 0) return;
    const latLngs = fleet.map((f) => [
      f.latestLocation?.latitude || 13.7563,
      f.latestLocation?.longitude || 100.5018,
    ]);
    mapInstanceRef.current.fitBounds(latLngs, { padding: [50, 50] });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-2xl">
      {/* Left Sidebar: Vehicle List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-brand-500 animate-pulse" />
            <span className="font-extrabold text-sm tracking-tight">รายการรถและพิกัด GPS สด</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-mono font-bold">
            {fleet.length} คัน
          </span>
        </div>

        <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
          {fleet.map((item) => {
            const isSelected = item.id === selectedVehicleId;
            const isAlert = item.latestLocation?.isOutOfZone;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedVehicleId(item.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected
                    ? 'bg-brand-950/80 border-brand-500 shadow-lg shadow-brand-950/50 ring-1 ring-brand-500/50'
                    : isAlert
                      ? 'bg-rose-950/40 border-rose-800 hover:bg-rose-900/30'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.vehicle.imageUrl}
                      alt={item.vehicle.model}
                      className="w-12 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-white">
                        {item.vehicle.brand} {item.vehicle.model}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.vehicle.licensePlate}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    {isAlert ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold inline-flex items-center gap-1 shadow-sm">
                        <AlertTriangle className="w-3 h-3" /> ออกนอกเขต
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold shadow-sm">
                        ปกติ
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Gauge className="w-3 h-3 text-brand-400" />
                    <span className="font-mono font-bold text-white">
                      {item.latestLocation?.speed || 0} km/h
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Battery className="w-3 h-3 text-emerald-400" />
                    <span className="font-mono font-bold text-white">{item.batteryLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-1 text-right justify-end">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{formatDate(item.lastSeenAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Real Leaflet GPS Map */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        {/* Out of zone alert banner if active */}
        {selectedVehicle?.latestLocation?.isOutOfZone && (
          <div className="p-4 bg-rose-950 border border-rose-500 rounded-2xl text-rose-200 text-xs flex items-center justify-between shadow-lg shadow-rose-950/80 animate-pulse">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-sm text-white block">
                  แจ้งเตือนด่วน: รถขับออกนอกเขตปลอดภัย (Geofence Breach)
                </span>
                <span className="text-[11px] text-rose-300">
                  {selectedVehicle.vehicle.brand} {selectedVehicle.vehicle.model} ({selectedVehicle.vehicle.licensePlate}) ขับออกนอกรัศมีควบคุม 35 กม.
                </span>
              </div>
            </div>
            {selectedVehicle.currentRenter && (
              <a
                href={`tel:${selectedVehicle.currentRenter.phone}`}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
              >
                โทรหาผู้เช่า ({selectedVehicle.currentRenter.phone})
              </a>
            )}
          </div>
        )}

        {/* Real Map Container with Controls */}
        <div className="relative flex-1 min-h-[440px] bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-inner">
          {/* Leaflet DOM Node */}
          <div ref={mapContainerRef} className="w-full h-[440px] z-0" />

          {/* Map Floating Control Bar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl text-xs">
            <button
              onClick={() => setMapType('dark')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${mapType === 'dark' ? 'bg-brand-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
            >
              โหมดดาร์ก
            </button>
            <button
              onClick={() => setMapType('voyager')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${mapType === 'voyager' ? 'bg-brand-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
            >
              แผนที่ถนน
            </button>
            <button
              onClick={() => setMapType('osm')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${mapType === 'osm' ? 'bg-brand-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={handleCenterAll}
              title="ดูตำแหน่งรถทั้งหมด"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 ml-1"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Geofence Legend Overlay */}
          <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-700 shadow-xl text-[11px] flex items-center gap-3 text-slate-300">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span>ศูนย์ใหญ่ BKK</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-1.5 rounded-full border border-brand-500 bg-brand-500/30"></span>
              <span>รัศมีปลอดภัย 35 กม.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span>รถออกนอกเขต</span>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Telemetry Info Card */}
        {selectedVehicle && (
          <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">พิกัด GPS สด (Real-time)</span>
              <span className="font-mono font-bold text-white">
                {selectedVehicle.latestLocation?.latitude.toFixed(4) || '13.7563'},{' '}
                {selectedVehicle.latestLocation?.longitude.toFixed(4) || '100.5018'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">ผู้เช่าปัจจุบัน</span>
              <span className="font-bold text-white">
                {selectedVehicle.currentRenter?.name || 'ไม่มีผู้เช่า (จอดที่ศูนย์)'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">เบอร์ติดต่อฉุกเฉิน</span>
              <span className="font-mono font-bold text-white">
                {selectedVehicle.currentRenter?.phone || '-'}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">รหัสกล่อง GPS</span>
              <span className="font-mono font-bold text-brand-400">
                {selectedVehicle.deviceSerial}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
