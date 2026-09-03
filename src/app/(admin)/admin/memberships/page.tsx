'use client';

import React, { useEffect, useState } from 'react';
import { Award, Shield, Check, Star, Users, Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function AdminMembershipsPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/memberships')
      .then((res) => res.json())
      .then((data) => {
        setTiers(data.tiers || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">ระดับสมาชิกและสิทธิพิเศษ (Memberships)</h1>
        <p className="text-xs text-slate-500 mt-0.5">โครงสร้างระดับสมาชิก ส่วนลด และสิทธิพิเศษของลูกค้า BigBike Club</p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: tier.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-extrabold text-sm px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${tier.color}15`, color: tier.color }}
                  >
                    {tier.name}
                  </span>
                  <Award className="w-5 h-5" style={{ color: tier.color }} />
                </div>

                <div className="mt-4">
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">
                    {tier.discountPercentage}% <span className="text-xs text-slate-400 font-normal">ส่วนลด</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    สะสมครบ {formatNumber(tier.minPoints)} แต้มขึ้นไป
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>ตัวคูณแต้มสะสม: {tier.multiplier}x</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{tier.perks}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> สมาชิกในระดับนี้
                </span>
                <span className="font-bold text-slate-800">{tier._count?.customers || 0} คน</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
