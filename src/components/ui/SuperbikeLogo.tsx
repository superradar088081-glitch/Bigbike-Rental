import React from 'react';
import { Bike } from 'lucide-react';

interface SuperbikeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SuperbikeLogo: React.FC<SuperbikeLogoProps> = ({
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-11 h-11 rounded-2xl',
    lg: 'w-14 h-14 rounded-3xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <div
      className={`bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-600/30 shrink-0 group-hover:scale-105 transition-transform duration-200 ${sizeClasses[size]} ${className}`}
    >
      <Bike className={iconSizes[size]} />
    </div>
  );
};
