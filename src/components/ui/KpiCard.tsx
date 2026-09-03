import React from 'react';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeText?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
  iconColorClass?: string;
  subtext?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  change,
  changeText,
  isPositive = true,
  icon,
  iconColorClass = 'text-brand-600 bg-brand-50 border-brand-100',
  subtext,
}) => {
  return (
    <Card className="p-6 flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div
          className={cn(
            'w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0',
            iconColorClass
          )}
        >
          {icon}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
          {value}
        </div>

        {(change !== undefined || changeText) && (
          <div className="flex items-center space-x-1.5 text-xs font-semibold">
            <span
              className={cn(
                'inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px]',
                isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1" />
              )}
              {changeText ? changeText : `${change}%`}
            </span>
            {subtext && <span className="text-slate-400 font-normal">{subtext}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
