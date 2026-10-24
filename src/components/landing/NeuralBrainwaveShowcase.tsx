import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Brain, Sparkles, Waves, Cpu, Eye } from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface SynapseNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
}

export const NeuralBrainwaveShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBand, setActiveBand] = useState<'alpha' | 'beta' | 'gamma'>('alpha');
  const [focusScore, setFocusScore] = useState(91);

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

  const handleBandSelect = (band: 'alpha' | 'beta' | 'gamma') => {
    spaceAudio.playClick();
    setActiveBand(band);
    if (band === 'alpha') setFocusScore(91);
    if (band === 'beta') setFocusScore(96);
    if (band === 'gamma') setFocusScore(84);
  };

  // Synaptic Network Canvas Animation
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

    // Generate synaptic nodes
    const nodeCount = 18;
    const nodes: SynapseNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (activeBand === 'gamma' ? 1.6 : activeBand === 'beta' ? 1.1 : 0.7),
        vy: (Math.random() - 0.5) * (activeBand === 'gamma' ? 1.6 : activeBand === 'beta' ? 1.1 : 0.7),
        radius: Math.random() * 2.5 + 2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.03;

      // Update and draw connections
      ctx.lineWidth = 1;
      const maxDist = 95;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.45;
            ctx.strokeStyle = `rgba(192, 132, 252, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Synaptic firing impulse spark
            if ((Math.sin(time * 3 + i + j) > 0.88)) {
              const sparkProgress = (Math.sin(time * 4 + i) + 1) / 2;
              const sparkX = nodes[i].x + (nodes[j].x - nodes[i].x) * sparkProgress;
              const sparkY = nodes[i].y + (nodes[j].y - nodes[i].y) * sparkProgress;
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = '#f0abfc';
              ctx.shadowColor = '#d946ef';
              ctx.shadowBlur = 10;
              ctx.fill();
            }
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        n.pulse += 0.05;
        const currentRadius = n.radius + Math.sin(n.pulse) * 1.2;

        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = '#e879f9';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 12;
        ctx.fill();
      }

      // Draw Oscillating EEG Sine Wave overlay on the bottom
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(216, 180, 254, 0.75)';
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#c084fc';
      const waveFreq = activeBand === 'gamma' ? 0.08 : activeBand === 'beta' ? 0.05 : 0.03;
      const waveAmp = activeBand === 'gamma' ? 14 : activeBand === 'beta' ? 10 : 8;

      for (let x = 0; x < width; x += 3) {
        const y = height - 24 + Math.sin(x * waveFreq + time * 3) * waveAmp + Math.cos(x * 0.02 - time * 2) * 4;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeBand]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-3d-card landing-card-left group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-purple transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full hover:shadow-[0_22px_55px_-8px_rgba(168,85,247,0.32),0_0_36px_rgba(192,132,252,0.25)] hover:border-purple-300/60"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300/80 to-transparent pointer-events-none" 
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full mb-3">
        <div className="flex items-center gap-3">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-purple-400/40 bg-purple-400/10 text-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.3)] flex-shrink-0">
            <Brain className="w-5 h-5 text-purple-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
              LIVE SYNAPSE MONITOR • PREVIEW ONLY
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Synaptic Brainwave Stream
            </h3>
          </div>
        </div>

        {/* Focus Score Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 text-[11px] font-mono text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span className="font-bold">INDEX {focusScore} • SYNAPSE HUD</span>
        </div>
      </div>

      {/* Interactive Neural Display */}
      <div className="relative z-10 w-full rounded-2xl border border-purple-400/30 bg-slate-950/20 overflow-hidden my-2 backdrop-blur-none pointer-events-none">
        <canvas ref={canvasRef} className="w-full h-[140px] sm:h-[155px] block pointer-events-none" />
        
        {/* Optical Telemetry Info */}
        <div className="absolute inset-x-0 bottom-1 px-3 py-1 flex items-center justify-between text-[10px] font-mono text-purple-300/70 border-t border-purple-500/20">
          <span>{activeBand.toUpperCase()} BAND • 10.4 HZ PEAK</span>
          <span>NEURO-PLASTICITY OPTIMAL</span>
        </div>
      </div>

      {/* Band Selection Buttons & Cognitive Metrics */}
      <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-purple-500/20">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">WAVE:</span>
          {(['alpha', 'beta', 'gamma'] as const).map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => handleBandSelect(band)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeBand === band
                  ? 'bg-purple-400 text-slate-950 shadow-[0_0_12px_rgba(192,132,252,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/15'
              }`}
            >
              {band}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-bold text-white">RECOVERY 94%</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-bold text-white">ALERT 100%</span>
          </span>
        </div>
      </div>
    </div>
  );
};
