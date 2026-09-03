import React from 'react';
import { cn, getStatusBadgeVariant } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'status' | 'default' | 'primary' | 'secondary' | 'outline' | 'danger';
  status?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  status,
  dot = false,
  children,
  ...props
}) => {
  if (status) {
    const s = getStatusBadgeVariant(status);
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs tracking-wide border shadow-sm transition-all',
          s.bg,
          className
        )}
        {...props}
      >
        <span className={cn('w-2 h-2 rounded-full shrink-0 animate-pulse', s.dot)} />
        <span>{children || s.labelTh}</span>
      </span>
    );
  }

  const variants: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    secondary: 'bg-slate-800 text-slate-100 border-slate-700',
    outline: 'bg-transparent border border-slate-200 text-slate-600',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    status: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const selectedVariantClass = variants[variant] || variants.default;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        selectedVariantClass,
        className
      )}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />}
      {children}
    </span>
  );
};
