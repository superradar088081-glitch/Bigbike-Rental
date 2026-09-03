'use client';

import React, { useEffect, useState } from 'react';
import { Award, Shield, Check, Star, Zap, Gift, Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function MembershipPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/memberships').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([tData, uData]) => {
        setTiers(tData.tiers || []);
        if (uData.user) setCurrentUser(uData.user);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">BigBike Club Rewards</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          ระดับสมาชิกและสิทธิประโยชน์
        </h1>
        <p className="text-sm text-slate-500">
          ทุกการเช่าสะสมแต้มแลกส่วนลด ยิ่งเช่ามาก ยิ่งได้รับส่วนลดและสิทธิพิเศษระดับ VIP
        </p>
      </div>

      {/* Customer Points Card Banner if logged in */}
      {currentUser?.customer && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Award className="w-5 h-5 text-brand-400" />
              <span className="font-bold text-xs uppercase tracking-wider text-brand-300">
                สถานะสมาชิกปัจจุบัน
              </span>
            </div>
            <h3 className="text-2xl font-extrabold">
              คุณ {currentUser.name} • {currentUser.customer?.membershipTier?.name || 'BRONZE'}
            </h3>
            <p className="text-xs text-slate-300">
              รับส่วนลด {currentUser.customer?.membershipTier?.discountPercentage || 0}% ทุกครั้งที่เช่า
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20 text-center">
            <span className="text-xs text-slate-300 block">แต้มสะสมคงเหลือ</span>
            <span className="text-3xl font-extrabold font-mono text-white mt-1 block">
              {formatNumber(currentUser.customer?.points || 0)}
            </span>
            <span className="text-[10px] text-brand-300 mt-1 block">1 แต้ม = ส่วนลด 1 บาท</span>
          </div>
        </div>
      )}

      {/* Membership Tiers Grid */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: tier.color }}
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className="font-extrabold text-sm px-3 py-1 rounded-full border"
                    style={{
                      backgroundColor: `${tier.color}15`,
                      color: tier.color,
                      borderColor: `${tier.color}30`,
                    }}
                  >
                    {tier.name}
                  </span>
                  <Award className="w-5 h-5" style={{ color: tier.color }} />
                </div>

                <div>
                  <div className="text-4xl font-extrabold text-slate-900 font-mono">
                    {tier.discountPercentage}%
                  </div>
                  <span className="text-xs text-slate-500 font-semibold block mt-1">ส่วนลดค่าเช่าทุกคัน</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    สะสมครบ {formatNumber(tier.minPoints)} แต้มขึ้นไป
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>ตัวคูณแต้มสะสม {tier.multiplier}x</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{tier.perks}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100">
                <Link href="/vehicles" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    เช่ารถสะสมแต้ม
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
