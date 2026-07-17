import React from 'react';
import { Truck } from 'lucide-react';

interface BrandLogoProps {
  variant?: 'full' | 'icon-only' | 'header' | 'login';
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function BrandLogo({
  variant = 'icon-only',
  className = '',
  iconSize,
  size,
}: BrandLogoProps) {

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-12 h-12 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl',
    xl: 'w-20 h-20 rounded-2xl',
    '2xl': 'w-28 h-28 rounded-3xl'
  };

  const selectedSize = sizeClasses[iconSize || size || 'md'];

  // High-fidelity Vector logo icon - replaces the broken logo.png image
  const logoIcon = (
    <div className={`bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md ${selectedSize} shrink-0`}>
      <Truck className="w-1/2 h-1/2 text-slate-950" />
    </div>
  );

  if (variant === 'icon-only') {
    return logoIcon;
  }

  if (variant === 'login') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`} id="brand_logo_login">
        <div className="bg-amber-100/50 p-2.5 rounded-2xl border border-amber-200/40 mb-4 hover:scale-105 transition-transform duration-300">
          {logoIcon}
        </div>
        <div className="font-sans leading-none flex flex-col items-center">
          <span className="text-3xl font-black tracking-tight uppercase text-slate-950">
            <span className="text-amber-500">PAU</span> <span className="text-slate-950">BRASIL</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-2 block leading-none">
            distribuidora <span className="text-amber-400 font-extrabold">ambev</span>
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center space-x-3 ${className}`} id="brand_logo_header">
        {logoIcon}
        <div className="leading-tight">
          <span className="font-sans font-black text-base tracking-tight block text-white uppercase">
            <span className="text-amber-400">PAU</span> <span className="text-white">BRASIL</span>
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.15em] text-slate-300 uppercase block leading-none mt-1">
            distribuidora <span className="text-amber-400 font-extrabold">ambev</span>
          </span>
        </div>
      </div>
    );
  }

  // Default 'full' variant (horizontal logo)
  return (
    <div className={`flex items-center space-x-4 ${className}`} id="brand_logo_full">
      {logoIcon}
      <div className="leading-tight">
        <span className="font-sans font-black text-2xl tracking-tight block uppercase text-slate-950">
          <span className="text-amber-500">PAU</span> <span className="text-slate-950">BRASIL</span>
        </span>
        <span className="font-sans text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mt-1.5 block leading-none">
          distribuidora <span className="text-amber-400 font-extrabold">ambev</span>
        </span>
      </div>
    </div>
  );
}

export default BrandLogo;
