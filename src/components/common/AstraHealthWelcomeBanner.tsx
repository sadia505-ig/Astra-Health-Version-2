import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, ChevronUp, ChevronDown } from 'lucide-react';

interface AstraHealthWelcomeBannerProps {
  variant?: 'landing' | 'dashboard';
  className?: string;
}

export const AstraHealthWelcomeBanner: React.FC<AstraHealthWelcomeBannerProps> = ({
  variant = 'dashboard',
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bannerRef = useRef<HTMLElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const banner = bannerRef.current;
    if (!banner) return;
    const rect = banner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 7.5;
    const rotY = ((x - centerX) / centerX) * 7.5;
    const moveX = ((x - centerX) / centerX) * 12;
    const moveY = ((y - centerY) / centerY) * 12;

    gsap.to(banner, {
      rotationX: rotX,
      rotationY: rotY,
      x: moveX,
      y: moveY,
      z: 24,
      scale: 1.015,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    const banner = bannerRef.current;
    if (!banner) return;
    gsap.to(banner, {
      rotationX: 0,
      rotationY: 0,
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <aside
      ref={bannerRef}
      id="astrahealth-welcome-banner"
      aria-label="Welcome to AstraHealth"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`gsap-slide-box tilt-box liquid-glass-card relative w-full overflow-hidden transition-all duration-300 select-text cursor-pointer ${
        variant === 'landing' ? 'max-w-2xl mx-auto' : 'w-full'
      } ${className} group`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" 
      />

      {/* Subtle Internal Crystal Edge Caustics (High Optical Transmittance for Earth View) */}
      <div 
        aria-hidden="true" 
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-40 rounded-full bg-cyan-400/5 blur-2xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-14 right-10 w-64 h-40 rounded-full bg-purple-400/4 blur-2xl pointer-events-none" 
      />

      <div className={`relative z-10 ${
        variant === 'landing' 
          ? 'py-8 px-6 sm:py-11 sm:px-8 md:py-13 md:px-10 min-h-[240px] sm:min-h-[265px] flex flex-col justify-center' 
          : 'p-6 sm:p-8'
      }`}>
        {/* Top-Right Collapse / Expand Button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl text-slate-300 hover:text-white liquid-glass-btn transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand description' : 'Minimize description'}
            aria-label={isCollapsed ? 'Expand description' : 'Minimize description'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Centered Welcoming Content */}
        <div className="flex flex-col items-center justify-center text-center space-y-3.5 sm:space-y-4">
          
          {/* Centered Glass Pill Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-[11px] sm:text-xs font-mono tracking-wider font-semibold text-cyan-200 uppercase shadow-[0_4px_16px_rgba(6,182,212,0.25)] border border-white/30 bg-white/10">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>ASTRONAUT HEALTH INTELLIGENCE</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-200">DEEP SPACE FLIGHT</span>
          </div>

          {/* Centered & Bigger Welcome Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white drop-shadow-[0_2px_16px_rgba(56,189,248,0.6)]">
            Welcome to AstraHealth
          </h2>

          {/* Centered & Clear Brief Description */}
          {!isCollapsed && (
            <p className="text-sm sm:text-base text-slate-100/95 leading-relaxed max-w-xl sm:max-w-2xl mx-auto font-sans pt-1.5 sm:pt-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
              Your autonomous mission health intelligence companion. AstraHealth continuously analyzes 
              physiological telemetry, detects subtle baseline deviations, tracks psychological adaptation, 
              and provides resilient dual online and offline AI guidance for long-duration space expeditions.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
};

// Backwards-compatible export alias
export const AstroHealthWelcomeBanner = AstraHealthWelcomeBanner;
