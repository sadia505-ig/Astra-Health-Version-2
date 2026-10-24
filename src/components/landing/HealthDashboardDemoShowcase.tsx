import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  ShieldCheck, 
  Gauge, 
  Compass, 
  Radio, 
  Sparkles,
  Zap,
  Layers,
  HeartPulse,
  Flame,
  Wind
} from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

type DemoViewMode = 'systems' | 'vitals' | 'alerts';

export const HealthDashboardDemoShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeMode, setActiveMode] = useState<DemoViewMode>('systems');
  const [simulatedPulse, setSimulatedPulse] = useState(72);
  const [systemIndex, setSystemIndex] = useState(98);

  // 3D Cursor Tilt & Translation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 7.5;
    const rotY = ((x - centerX) / centerX) * 7.5;
    const moveX = ((x - centerX) / centerX) * 6;
    const moveY = ((y - centerY) / centerY) * 6;

    gsap.to(el, {
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

  const handleMouseLeave = () => {
    const el = containerRef.current;
    if (!el) return;
    gsap.to(el, {
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

  const handleModeChange = (mode: DemoViewMode) => {
    spaceAudio.playClick();
    setActiveMode(mode);
  };

  // Subtle real-time telemetry fluctuation for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedPulse((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(68, Math.min(76, prev + delta));
      });
      setSystemIndex((prev) => {
        const delta = Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : -1;
        return Math.max(96, Math.min(100, prev + delta));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-3d-card landing-card-right tilt-box group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-amber transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full hover:shadow-[0_22px_55px_-8px_rgba(245,158,11,0.32),0_0_36px_rgba(251,191,36,0.25)] hover:border-amber-300/60"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" 
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full mb-2 sm:mb-2.5">
        <div className="flex items-center gap-3">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-amber-400/40 bg-amber-400/10 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.3)] flex-shrink-0">
            <LayoutDashboard className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
              LIVE TELEMETRY HUD • PREVIEW ONLY
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Health Dashboard Demo
            </h3>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold">{systemIndex}% NOMINAL • DEMO HUD</span>
        </div>
      </div>

      {/* Live Interactive Command Center Demo Display - VITAL NAVY BOX (#030519) */}
      <div className="vital-navy-box vital-data-card tilt-box relative z-10 w-full rounded-2xl border border-amber-500/30 p-3 sm:p-3.5 my-1.5 overflow-hidden shadow-inner flex flex-col justify-between min-h-[145px] sm:min-h-[155px]">
        {/* Sub-header inside HUD */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider">
            <Gauge className="w-3.5 h-3.5 text-amber-400" />
            {activeMode === 'systems' && 'TELEMETRY SURVEILLANCE MATRIX'}
            {activeMode === 'vitals' && 'CREW BIOMETRIC EQUILIBRIUM'}
            {activeMode === 'alerts' && 'AUTONOMOUS RISK MONITORING'}
          </span>
          <span className="text-slate-400">SOL 184 • FLIGHT DAY 42</span>
        </div>

        {/* 1. SYSTEMS MODE: Multi-Domain Space Health Status */}
        {activeMode === 'systems' && (
          <div className="grid grid-cols-2 gap-2 my-1 text-[11px] font-mono animate-fadeIn">
            {/* System 1: Bio Signal */}
            <div className="bg-slate-950/80 p-2 rounded-xl border border-cyan-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1 text-cyan-300 font-bold text-[10px]">
                  <Activity className="w-3 h-3 text-cyan-400" /> BIO SIGNAL
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">98%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1 text-slate-200">
                <span className="text-xs font-bold">{simulatedPulse} bpm</span>
                <span className="text-[10px] text-slate-400">SpO₂ 99%</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '98%' }} />
              </div>
            </div>

            {/* System 2: Neural Signal */}
            <div className="bg-slate-950/80 p-2 rounded-xl border border-purple-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1 text-purple-300 font-bold text-[10px]">
                  <Brain className="w-3 h-3 text-purple-400" /> NEURAL FLUX
                </span>
                <span className="text-[10px] text-purple-300 font-bold">94%</span>
              </div>
              <div className="flex items-baseline justify-between mt-1 text-slate-200">
                <span className="text-xs font-bold">7.4h Sleep</span>
                <span className="text-[10px] text-slate-400">Rec 91%</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-purple-400 h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* System 3: ECLSS Life Support */}
            <div className="bg-slate-950/80 p-2 rounded-xl border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1 text-emerald-300 font-bold text-[10px]">
                  <Wind className="w-3 h-3 text-emerald-400" /> ECLSS CABIN
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">NOMINAL</span>
              </div>
              <div className="flex items-baseline justify-between mt-1 text-slate-200">
                <span className="text-xs font-bold">O₂ 21.0%</span>
                <span className="text-[10px] text-slate-400">101.3 kPa</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* System 4: Radiation Dosimeter */}
            <div className="bg-slate-950/80 p-2 rounded-xl border border-amber-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1 text-amber-300 font-bold text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-amber-400" /> DOSIMETRY
                </span>
                <span className="text-[10px] text-amber-300 font-bold">0.42 mSv</span>
              </div>
              <div className="flex items-baseline justify-between mt-1 text-slate-200">
                <span className="text-xs font-bold">Shield Active</span>
                <span className="text-[10px] text-emerald-400">Quiet Sun</span>
              </div>
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        )}

        {/* 2. VITALS MODE: Real-time Cardiovascular & Metabolic Gauges */}
        {activeMode === 'vitals' && (
          <div className="space-y-1.5 my-1 text-[11px] font-mono animate-fadeIn">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-cyan-500/20 text-center">
                <div className="text-[9px] text-slate-400 uppercase">Blood Pressure</div>
                <div className="text-sm font-bold text-slate-100 mt-0.5">118/76</div>
                <div className="text-[9px] text-emerald-400 font-semibold">Optimal</div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-cyan-500/20 text-center">
                <div className="text-[9px] text-slate-400 uppercase">Heart Rate Var</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">68 ms</div>
                <div className="text-[9px] text-slate-300 font-semibold">Baseline +4%</div>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-cyan-500/20 text-center">
                <div className="text-[9px] text-slate-400 uppercase">Core Temp</div>
                <div className="text-sm font-bold text-amber-300 mt-0.5">36.8°C</div>
                <div className="text-[9px] text-emerald-400 font-semibold">Equilibrium</div>
              </div>
            </div>

            {/* Real-time EKG strip bar */}
            <div className="bg-slate-950/90 px-2.5 py-1.5 rounded-xl border border-cyan-500/25 flex items-center justify-between text-[10px]">
              <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Telemetry Buffer
              </span>
              <span className="text-slate-300">14-Day Rolling Equilibrium • 0 Anomalies</span>
            </div>
          </div>
        )}

        {/* 3. ALERTS MODE: Mission Health Intelligence & NASA Link */}
        {activeMode === 'alerts' && (
          <div className="space-y-1.5 my-1 text-[11px] font-mono animate-fadeIn">
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-200">All Systems Nominal</div>
                  <div className="text-[10px] text-emerald-300/80">0 critical health alerts detected.</div>
                </div>
              </div>
              <span className="text-[9px] font-bold bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-300">
                ACTIVE
              </span>
            </div>

            <div className="bg-slate-950/80 border border-amber-500/25 p-2 rounded-xl flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-300">Earth Comms Latency: <strong className="text-amber-300">14.2 min</strong></span>
              </div>
              <span className="text-slate-400">Autonomous Edge AI</span>
            </div>
          </div>
        )}

        {/* Bottom HUD Telemetry Strip */}
        <div className="flex items-center justify-between pt-1 border-t border-amber-500/15 text-[9px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            READINESS: 4/4 CREW ACTIVE
          </span>
          <span className="text-amber-300/90 font-bold">GROUND SYNC: NOMINAL</span>
        </div>
      </div>

      {/* Mode Switcher & Telemetry Metrics */}
      <div className="relative z-10 mt-2 sm:mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-500/20">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">DEMO:</span>
          {(['systems', 'vitals', 'alerts'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleModeChange(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeMode === mode
                  ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/15'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">4 NODES</span>
          </span>
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">AUTONOMOUS</span>
          </span>
        </div>
      </div>
    </div>
  );
};
