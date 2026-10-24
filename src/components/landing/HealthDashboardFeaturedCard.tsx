import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  BarChart3, 
  Layers, 
  ArrowRight, 
  ClipboardCheck 
} from 'lucide-react';
import { HealthMeasurement } from '../../types/health';
import { ActiveModuleType } from './CentralMissionCore';
import { spaceAudio } from '../../utils/spaceAudio';

export interface HealthDashboardFeaturedCardProps {
  id?: string;
  currentMeasurement: HealthMeasurement;
  whatChangedCount: number;
  dashboardLabel: string;
  onHoverStart?: (key: ActiveModuleType) => void;
  onHoverEnd?: () => void;
  onClick: () => void;
  onEnterCheckup?: () => void;
}

export const HealthDashboardFeaturedCard: React.FC<HealthDashboardFeaturedCardProps> = ({
  id = 'btn-dashboard-featured',
  currentMeasurement: _currentMeasurement,
  whatChangedCount,
  dashboardLabel,
  onHoverStart,
  onHoverEnd,
  onClick,
  onEnterCheckup,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 7.5;
    const rotY = ((x - centerX) / centerX) * 7.5;
    const moveX = ((x - centerX) / centerX) * 6;
    const moveY = ((y - centerY) / centerY) * 6;

    gsap.to(cardRef.current, {
      rotationX: rotX,
      rotationY: rotY,
      x: moveX,
      y: moveY,
      z: 16,
      scale: 1.015,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    spaceAudio.playClick();
    onHoverStart?.('DASHBOARD');
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverEnd?.();
    if (cardRef.current) {
      gsap.to(cardRef.current, {
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
    }
  };

  const handleCardClick = () => {
    spaceAudio.playQuindar();
    onClick();
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onClick={handleCardClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="gsap-3d-card landing-card-left tilt-box group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-amber transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full border-2 border-amber-400/60 shadow-[0_0_24px_rgba(245,158,11,0.28),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:border-amber-300 hover:shadow-[0_0_36px_rgba(245,158,11,0.48),inset_0_1px_2px_rgba(255,255,255,0.7)]"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-200 to-transparent pointer-events-none" 
      />

      {/* Subtle Specular Highlight following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(253, 230, 138, 0.28), transparent 70%)`,
        }}
      />

      {/* Radiant Portal Ambient Glow (Highlights Health Dashboard as Primary Navigational Portal) */}
      <div 
        aria-hidden="true" 
        className="absolute -top-10 -left-10 w-72 h-52 rounded-full bg-amber-400/15 blur-3xl pointer-events-none animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-10 -right-10 w-64 h-48 rounded-full bg-orange-400/12 blur-3xl pointer-events-none" 
      />

      {/* 0. Primary Navigation Portal Identifier Badge */}
      <div className="relative z-10 flex items-center justify-between mb-2 pb-1 border-b border-amber-500/25">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 text-[10px] font-mono font-extrabold uppercase text-amber-200 tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
          <span>PRIMARY COMMAND PORTAL</span>
          <span className="text-amber-400/70">•</span>
          <span className="text-amber-100">CLICK TO ENTER</span>
        </span>

        <span className="text-[10px] font-mono text-amber-300/80 font-bold uppercase tracking-widest hidden sm:inline-block">
          COMMAND CENTER
        </span>
      </div>

      {/* 1. Top Header Row: Icon, Title, Telemetry Tag & Status Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-amber-300/50 bg-amber-400/25 text-amber-200 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 shadow-[0_0_18px_rgba(245,158,11,0.4)]">
            <BarChart3 className="w-5 h-5 text-amber-200" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-amber-300 uppercase font-bold">
                COMMAND CONSOLE PORTAL
              </span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-amber-200 font-mono tracking-wide truncate transition-colors drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]">
              Health Dashboard
            </h3>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-mono tracking-wider px-3.5 py-1 rounded-full border border-amber-300/60 bg-amber-900/60 text-amber-200 font-extrabold whitespace-nowrap shadow-[0_0_14px_rgba(245,158,11,0.35)]">
          {dashboardLabel}
        </span>
      </div>

      {/* 2. Added Feature Description */}
      <div className="relative z-10 my-3 text-left">
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-medium">
          Daily operational astronaut health & psychological monitoring during deep-space flight.
        </p>
      </div>

      {/* 3. Micro-Telemetry Row & Luminous "Enter Health Command Center" Action Button */}
      <div className="relative z-10 pt-3 border-t border-amber-400/30 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs font-mono text-slate-200">
        
        {/* Baseline Telemetry Metrics & Baseline Progress Indicator in Dark Navy Box (#030519) */}
        <div className="vital-navy-box px-3.5 py-2 rounded-xl border border-amber-500/40 flex items-center gap-2.5 sm:gap-3 flex-wrap shadow-md">
          <span className="text-amber-300 flex items-center gap-1 font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>{whatChangedCount} Shifts</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200">14-Day Baseline</span>

          {/* Animated Baseline Gradient Bar */}
          <div className="w-16 sm:w-20 h-2 bg-slate-900/60 rounded-full overflow-hidden border border-amber-300/40 ml-1">
            <div className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 rounded-full w-[88%] animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
        </div>

        {/* Luminous & Brilliant "Enter Health Command Center" Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-dashboard-enter"
            onClick={(e) => {
              e.stopPropagation();
              spaceAudio.playQuindar();
              if (onEnterCheckup) {
                onEnterCheckup();
              } else {
                onClick();
              }
            }}
            className="group/btn relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 hover:from-amber-300 hover:via-white hover:to-amber-300 text-slate-950 font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer border border-amber-100/90 shadow-[0_0_18px_rgba(245,158,11,0.65),inset_0_1px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(245,158,11,0.85),inset_0_1px_3px_rgba(255,255,255,1)] hover:scale-[1.03] active:scale-[0.98]"
            title="Enter Health Command Center & Mission Console"
            aria-label="Enter Health Command Center"
          >
            {/* Inner specular top sheen */}
            <span 
              aria-hidden="true" 
              className="absolute inset-x-1 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none rounded-full" 
            />
            <BarChart3 className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>ENTER HEALTH COMMAND CENTER</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
