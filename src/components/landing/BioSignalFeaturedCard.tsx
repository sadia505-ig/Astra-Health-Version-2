import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  HeartPulse, 
  Activity, 
  ArrowRight, 
  ClipboardCheck, 
  Sparkles 
} from 'lucide-react';
import { HealthMeasurement } from '../../types/health';
import { ActiveModuleType } from './CentralMissionCore';
import { spaceAudio } from '../../utils/spaceAudio';

export interface BioSignalFeaturedCardProps {
  id?: string;
  currentMeasurement: HealthMeasurement;
  physicalScore: number;
  onHoverStart?: (key: ActiveModuleType) => void;
  onHoverEnd?: () => void;
  onClick: () => void;
  onStartCheckIn?: () => void;
  onEnterCheckup?: () => void;
}

export const BioSignalFeaturedCard: React.FC<BioSignalFeaturedCardProps> = ({
  id = 'btn-bio-signal-featured',
  currentMeasurement,
  physicalScore,
  onHoverStart,
  onHoverEnd,
  onClick,
  onStartCheckIn,
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
    onHoverStart?.('PHYSICAL');
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
      className="gsap-3d-card landing-card-left tilt-box group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-cyan transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full border-2 border-cyan-400/60 shadow-[0_0_24px_rgba(6,182,212,0.28),inset_0_1px_1px_rgba(255,255,255,0.5)] hover:border-cyan-300 hover:shadow-[0_0_36px_rgba(6,182,212,0.48),inset_0_1px_2px_rgba(255,255,255,0.7)]"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent pointer-events-none" 
      />

      {/* Subtle Specular Highlight following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(103, 232, 249, 0.28), transparent 70%)`,
        }}
      />

      {/* Radiant Portal Ambient Glow (Highlights Bio Signal as Primary Navigational Portal) */}
      <div 
        aria-hidden="true" 
        className="absolute -top-10 -left-10 w-72 h-52 rounded-full bg-cyan-400/15 blur-3xl pointer-events-none animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-10 -right-10 w-64 h-48 rounded-full bg-sky-400/12 blur-3xl pointer-events-none" 
      />

      {/* 0. Primary Navigation Portal Identifier Badge */}
      <div className="relative z-10 flex items-center justify-between mb-2 pb-1 border-b border-cyan-500/25">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-300/60 text-[10px] font-mono font-extrabold uppercase text-cyan-200 tracking-wider shadow-[0_0_12px_rgba(6,182,212,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
          <span>PRIMARY MODULE PORTAL</span>
          <span className="text-cyan-400/70">•</span>
          <span className="text-cyan-100">CLICK TO ENTER</span>
        </span>

        <span className="text-[10px] font-mono text-cyan-300/80 font-bold uppercase tracking-widest hidden sm:inline-block">
          SYSTEM 01
        </span>
      </div>

      {/* 1. Top Header Row: Icon, Title, Biometrics Tag & Score Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-cyan-300/50 bg-cyan-400/25 text-cyan-200 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 shadow-[0_0_18px_rgba(6,182,212,0.4)]">
            <HeartPulse className="w-5 h-5 text-cyan-200 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-cyan-300 uppercase font-bold">
                BIOMETRICS PORTAL
              </span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-cyan-200 font-mono tracking-wide truncate transition-colors drop-shadow-[0_0_12px_rgba(103,232,249,0.5)]">
              Bio Signal
            </h3>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-mono tracking-wider px-3.5 py-1 rounded-full border border-cyan-300/60 bg-cyan-900/60 text-cyan-200 font-extrabold whitespace-nowrap shadow-[0_0_14px_rgba(6,182,212,0.35)]">
          INDEX {physicalScore}
        </span>
      </div>

      {/* 2. Added Feature Description (1-2 lines) */}
      <div className="relative z-10 my-3 text-left">
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-medium">
          Continuous monitoring of cardiovascular reserve, pulmonary efficiency, musculoskeletal conditioning, and recovery debt.
        </p>
      </div>

      {/* 3. Micro-Telemetry Row & Luminous "Enter Bio Signal Checkup" Action Button */}
      <div className="relative z-10 pt-3 border-t border-cyan-400/30 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs font-mono text-slate-200">
        
        {/* Physical Biometrics Metrics & Waveform in Dark Navy Box (#030519) */}
        <div className="vital-navy-box px-3.5 py-2 rounded-xl border border-cyan-500/40 flex items-center gap-2.5 sm:gap-3 flex-wrap shadow-md">
          <span className="text-cyan-300 flex items-center gap-1 font-semibold">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>{currentMeasurement.restingHeartRate} bpm</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-200">{currentMeasurement.hrv}ms HRV</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-emerald-300 font-medium hidden sm:inline">{currentMeasurement.spo2}% SpO₂</span>

          {/* Animated ECG Waveform */}
          <div className="w-16 sm:w-20 h-4 sm:h-5 overflow-hidden flex items-center ml-1">
            <svg className="w-full h-full" viewBox="0 0 100 20" fill="none">
              <path
                d="M 0 10 L 25 10 L 32 2 L 40 18 L 48 10 L 60 10 L 66 5 L 72 15 L 78 10 L 100 10"
                stroke="#67e8f9"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="animate-ecg drop-shadow-[0_0_6px_rgba(103,232,249,0.9)]"
              />
            </svg>
          </div>
        </div>

        {/* Luminous & Brilliant "Enter Bio Signal Checkup" Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-enter-checkup"
            onClick={(e) => {
              e.stopPropagation();
              spaceAudio.playQuindar();
              if (onEnterCheckup) {
                onEnterCheckup();
              } else {
                onClick();
              }
            }}
            className="group/btn relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 hover:from-cyan-300 hover:via-white hover:to-cyan-300 text-slate-950 font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer border border-cyan-100/90 shadow-[0_0_18px_rgba(6,182,212,0.65),inset_0_1px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(6,182,212,0.85),inset_0_1px_3px_rgba(255,255,255,1)] hover:scale-[1.03] active:scale-[0.98]"
            title="Open Full Bio Signal Page & Astronaut Telemetry"
            aria-label="Enter Bio Signal Checkup"
          >
            {/* Inner specular top sheen */}
            <span 
              aria-hidden="true" 
              className="absolute inset-x-1 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none rounded-full" 
            />
            <ClipboardCheck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>ENTER BIO SIGNAL CHECKUP</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
