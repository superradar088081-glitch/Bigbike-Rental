'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

export interface RevenueDataPoint {
  name: string;
  revenue: number;
}

export interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const defaultData = [
    { name: 'ม.ค.', revenue: 45000 },
    { name: 'ก.พ.', revenue: 68000 },
    { name: 'มี.ค.', revenue: 54000 },
    { name: 'เม.ย.', revenue: 112000 },
    { name: 'พ.ค.', revenue: 128500 },
    { name: 'มิ.ย.', revenue: 85000 },
    { name: 'ก.ค.', revenue: 92000 },
    { name: 'ส.ค.', revenue: 78000 },
    { name: 'ก.ย.', revenue: 95000 },
    { name: 'ต.ค.', revenue: 110000 },
    { name: 'พ.ย.', revenue: 135000 },
    { name: 'ธ.ค.', revenue: 155000 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 100000);
  const height = 200;
  const width = 600;
  const paddingX = 30;
  const paddingY = 20;

  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.revenue / maxRevenue) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  // Bezier Curve Path Generator
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="relative overflow-hidden w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto select-none overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e11d48" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height / 2}
            x2={width - paddingX}
            y2={height / 2}
            stroke="#f1f5f9"
            strokeDasharray="4 4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="#e2e8f0"
          />

          {/* Area fill */}
          <path d={areaD} fill="url(#chartGradient)" />

          {/* Smooth line */}
          <path d={pathD} fill="none" stroke="#e11d48" strokeWidth="3" strokeLinecap="round" />

          {/* Interactive Points */}
          {points.map((p, idx) => (
            <g
              key={idx}
              className="cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === idx ? 6 : 4}
                className={`transition-all ${
                  hoveredIndex === idx
                    ? 'fill-brand-600 stroke-white stroke-2'
                    : 'fill-white stroke-brand-600 stroke-2'
                }`}
              />
              <text
                x={p.x}
                y={height - 4}
                textAnchor="middle"
                className="text-[10px] fill-slate-400 font-sans"
              >
                {p.name}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="absolute z-10 pointer-events-none bg-slate-900 text-white text-xs px-3 py-1.5 rounded-xl shadow-xl -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${(points[hoveredIndex].y / height) * 100}%`,
            }}
          >
            <div className="font-semibold text-slate-300 text-[10px]">{points[hoveredIndex].name}</div>
            <div className="font-bold text-brand-400 font-mono">
              {formatCurrency(points[hoveredIndex].revenue)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
