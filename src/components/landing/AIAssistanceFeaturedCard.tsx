import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Bot, 
  Cpu, 
  ArrowRight, 
  MessageSquare 
} from 'lucide-react';
import { ActiveModuleType } from './CentralMissionCore';
import { spaceAudio } from '../../utils/spaceAudio';

export interface AIAssistanceFeaturedCardProps {
  id?: string;
  isOffline: boolean;
  activeAiSource: string;
  aiStatusLabel: string;
  onHoverStart?: (key: ActiveModuleType) => void;
  onHoverEnd?: () => void;
  onClick: () => void;
  onEnterCheckup?: () => void;
}

export const AIAssistanceFeaturedCard: React.FC<AIAssistanceFeaturedCardProps> = ({
  id = 'btn-ai-featured',
  isOffline,
  activeAiSource: _activeAiSource,
  aiStatusLabel,
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
    onHoverStart?.('AI');
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
      className="gsap-3d-card landing-card-right tilt-box group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-blue transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full hover:shadow-[0_22px_55px_-8px_rgba(59,130,246,0.32),0_0_36px_rgba(96,165,250,0.25)] hover:border-blue-300/60"
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

      {/* Subtle Specular Highlight following Cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(147, 197, 253, 0.28), transparent 70%)`,
        }}
      />

      {/* Radiant Portal Ambient Glow (Highlights AI Assistance as Primary Navigational Portal) */}
      <div 
        aria-hidden="true" 
        className="absolute -top-10 -left-10 w-72 h-52 rounded-full bg-blue-500/18 blur-3xl pointer-events-none animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-10 -right-10 w-64 h-48 rounded-full bg-cyan-400/14 blur-3xl pointer-events-none" 
      />

      {/* 0. Primary Navigation Portal Identifier Badge */}
      <div className="relative z-10 flex items-center justify-between mb-2 pb-1 border-b border-blue-500/25">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-400/20 border border-blue-300/60 text-[10px] font-mono font-extrabold uppercase text-blue-200 tracking-wider shadow-[0_0_12px_rgba(59,130,246,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-ping" />
          <span>PRIMARY INTELLIGENCE PORTAL</span>
          <span className="text-blue-400/70">•</span>
          <span className="text-blue-100">CLICK TO ASK</span>
        </span>

        <span className="text-[10px] font-mono text-blue-300/80 font-bold uppercase tracking-widest hidden sm:inline-block">
          AI COPILOT
        </span>
      </div>

      {/* 1. Top Header Row: Icon, Title, Engine Tag & Mode Badge */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-blue-300/50 bg-blue-400/25 text-blue-200 group-hover:scale-105 transition-transform duration-200 flex-shrink-0 shadow-[0_0_18px_rgba(59,130,246,0.4)]">
            <Bot className="w-5 h-5 text-blue-200 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-ping" />
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-blue-300 uppercase font-bold">
                ASTRA AI COPILOT PORTAL
              </span>
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-blue-200 font-mono tracking-wide truncate transition-colors drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]">
              AI Assistance
            </h3>
          </div>
        </div>

        <span className="text-xs sm:text-sm font-mono tracking-wider px-3.5 py-1 rounded-full border border-blue-300/60 bg-blue-900/60 text-blue-200 font-extrabold whitespace-nowrap shadow-[0_0_14px_rgba(59,130,246,0.35)]">
          {aiStatusLabel}
        </span>
      </div>

      {/* 2. Added Feature Description */}
      <div className="relative z-10 my-3 text-left">
        <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans font-medium">
          Ask ASTRA about your health, mission conditions, space radiation dosage, or recent biometric shifts.
        </p>
      </div>

      {/* 3. Micro-Telemetry Row & Luminous "Enter ASTRA AI Assistance" Action Button */}
      <div className="relative z-10 pt-3 border-t border-blue-400/30 flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs font-mono text-slate-200">
        
        {/* AI Engine Status & Synaptic Pulses in Dark Navy Box (#030519) */}
        <div className="vital-navy-box px-3.5 py-2 rounded-xl border border-blue-500/40 flex items-center gap-2.5 sm:gap-3 flex-wrap shadow-md">
          <span className="text-blue-300 flex items-center gap-1 font-semibold">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{isOffline ? 'Local Engine' : 'Gemini 2.5'}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-300 font-medium">{isOffline ? '0ms Comms' : 'Orbit Live'}</span>

          {/* Animated Synaptic Indicator Dots */}
          <div className="flex items-center gap-1 ml-1">
            <div className="w-1.5 h-2.5 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-3.5 bg-cyan-200 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Luminous & Brilliant "ASK ASTRA AI ASSISTANCE" Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-ai-ask-astra"
            onClick={(e) => {
              e.stopPropagation();
              spaceAudio.playQuindar();
              if (onEnterCheckup) {
                onEnterCheckup();
              } else {
                onClick();
              }
            }}
            className="group/btn relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-400 via-sky-200 to-blue-400 hover:from-blue-300 hover:via-white hover:to-blue-300 text-slate-950 font-mono text-xs font-black tracking-wider uppercase transition-all duration-300 cursor-pointer border border-blue-100/90 shadow-[0_0_18px_rgba(59,130,246,0.65),inset_0_1px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_0_28px_rgba(59,130,246,0.85),inset_0_1px_3px_rgba(255,255,255,1)] hover:scale-[1.03] active:scale-[0.98]"
            title="Ask ASTRA AI Assistant & Medical Co-Pilot"
            aria-label="Ask ASTRA AI Assistance"
          >
            {/* Inner specular top sheen */}
            <span 
              aria-hidden="true" 
              className="absolute inset-x-1 top-0.5 h-[1.5px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none rounded-full" 
            />
            <MessageSquare className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>ASK ASTRA AI ASSISTANCE</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
