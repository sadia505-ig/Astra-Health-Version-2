import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Activity, Heart, Zap, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

export const BioSignalEcgShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bpmMode, setBpmMode] = useState<'resting' | 'active' | 'eva'>('resting');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentBpm, setCurrentBpm] = useState(72);

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

  // Switch BPM Modes
  const handleModeChange = (mode: 'resting' | 'active' | 'eva') => {
    spaceAudio.playClick();
    setBpmMode(mode);
    if (mode === 'resting') setCurrentBpm(64);
    if (mode === 'active') setCurrentBpm(88);
    if (mode === 'eva') setCurrentBpm(114);
  };

  // Real-time Canvas ECG Oscilloscope Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = 160);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 160;
      }
    };
    window.addEventListener('resize', handleResize);

    let sweepX = 0;
    const points: { x: number; y: number }[] = [];
    const maxPoints = Math.floor(width);

    // ECG pattern generator based on BPM
    const speed = bpmMode === 'resting' ? 2.5 : bpmMode === 'active' ? 3.8 : 5.0;
    let cycleCounter = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle cyan grid background
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG wave formula
      cycleCounter += speed;
      const cycleLength = bpmMode === 'resting' ? 160 : bpmMode === 'active' ? 110 : 80;
      const t = (cycleCounter % cycleLength) / cycleLength;

      let waveY = height / 2;
      if (t > 0.15 && t < 0.22) {
        // P-wave
        waveY -= Math.sin(((t - 0.15) / 0.07) * Math.PI) * 10;
      } else if (t > 0.28 && t < 0.32) {
        // Q dip
        waveY += 8;
      } else if (t >= 0.32 && t < 0.38) {
        // R spike (peak QRS)
        const peakT = (t - 0.32) / 0.06;
        waveY -= Math.sin(peakT * Math.PI) * 58;
      } else if (t >= 0.38 && t < 0.42) {
        // S dip
        waveY += 16;
      } else if (t > 0.52 && t < 0.68) {
        // T-wave
        waveY -= Math.sin(((t - 0.52) / 0.16) * Math.PI) * 16;
      }

      sweepX = (sweepX + speed) % width;
      points.push({ x: sweepX, y: waveY });
      if (points.length > maxPoints) {
        points.shift();
      }

      // Draw ECG phosphor trail
      if (points.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;

        for (let i = 0; i < points.length; i++) {
          const pt = points[i];
          if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            // Discontinuity reset
            if (Math.abs(pt.x - points[i - 1].x) > 20) {
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
        }
        ctx.stroke();

        // Glowing pulse head
        const lastPt = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#67e8f9';
        ctx.shadowColor = '#67e8f9';
        ctx.shadowBlur = 16;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [bpmMode]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-3d-card landing-card-right group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-cyan transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full hover:shadow-[0_22px_55px_-8px_rgba(6,182,212,0.32),0_0_36px_rgba(56,189,248,0.25)] hover:border-cyan-300/60"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full mb-3">
        <div className="flex items-center gap-3">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_14px_rgba(6,182,212,0.3)] flex-shrink-0">
            <Activity className="w-5 h-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
              LIVE SENSOR MONITOR • PREVIEW ONLY
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Cardiovascular Oscilloscope
            </h3>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold">{currentBpm} BPM • SENSOR HUD</span>
        </div>
      </div>

      {/* Interactive Oscilloscope Display */}
      <div className="relative z-10 w-full rounded-2xl border border-cyan-400/30 bg-slate-950/20 overflow-hidden my-2 backdrop-blur-none pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-[140px] sm:h-[155px] block pointer-events-none" />
        
        {/* Optical Scanning Line Flare */}
        <div className="absolute inset-x-0 bottom-1 px-3 py-1 flex items-center justify-between text-[10px] font-mono text-cyan-300/70 border-t border-cyan-500/20">
          <span>SINUS RHYTHM • QTc 410ms</span>
          <span>SPO2 99% • CARDIAC OUT 5.2L/M</span>
        </div>
      </div>

      {/* Interactive Mode Controls & Telemetry Stats */}
      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-cyan-500/20">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">RHYTHM:</span>
          {(['resting', 'active', 'eva'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleModeChange(mode)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                bpmMode === mode
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/15'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span className="font-bold text-white">HRV 68ms</span>
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">EFF 98%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
