'use client';

import React from 'react';

export interface StatusCounts {
  pending: number;
  confirmed: number;
  active: number;
  completed: number;
  cancelled: number;
}

export interface StatusDonutChartProps {
  counts?: StatusCounts;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  counts = { pending: 12, confirmed: 18, active: 10, completed: 30, cancelled: 5 },
}) => {
  const data = [
    { label: 'รอดำเนินการ', count: counts.pending, color: '#f59e0b' },
    { label: 'อนุมัติแล้ว', count: counts.confirmed, color: '#3b82f6' },
    { label: 'กำลังใช้งาน', count: counts.active, color: '#8b5cf6' },
    { label: 'เสร็จสิ้น', count: counts.completed, color: '#10b981' },
    { label: 'ยกเลิก', count: counts.cancelled, color: '#ef4444' },
  ];

  const total = data.reduce((acc, item) => acc + item.count, 0);

  const size = 180;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;
  const segments = data.map((item) => {
    const fraction = total > 0 ? item.count / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -currentOffset;
    currentOffset += fraction * circumference;
    return {
      ...item,
      strokeDasharray,
      strokeDashoffset,
      percentage: total > 0 ? Math.round(fraction * 100) : 0,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
      {/* SVG Donut */}
      <div className="relative w-44 h-44 shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {segments.map((seg, idx) => (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.strokeDasharray}
              strokeDashoffset={seg.strokeDashoffset}
              className="transition-all duration-500 hover:opacity-80"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-slate-900 font-mono">{total}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2 text-xs w-full max-w-[200px]">
        {segments.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600">{item.label}</span>
            </div>
            <span className="font-bold text-slate-800 font-mono">
              {item.count}{' '}
              <span className="text-slate-400 font-normal">({item.percentage}%)</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
