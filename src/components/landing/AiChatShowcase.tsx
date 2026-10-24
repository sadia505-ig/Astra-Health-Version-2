import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  Bot, 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Cpu, 
  CheckCircle2, 
  Activity, 
  Zap, 
  Send,
  MessageSquare
} from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface AiDemoTopic {
  id: 'audit' | 'radiation' | 'circadian';
  label: string;
  query: string;
  response: string;
  badge: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

const DEMO_TOPICS: Record<string, AiDemoTopic> = {
  audit: {
    id: 'audit',
    label: 'EVA AUDIT',
    query: 'Astra, evaluate post-EVA biometrics. Heart rate peaked at 105 bpm.',
    response: 'EVA 4h 18m analyzed. Heart rate nominal at 68 bpm. Hydration -420ml below baseline. Recommendation: 500ml electrolyte buffer before sleep.',
    badge: 'DIAGNOSTIC NOMINAL',
    metrics: [
      { label: 'REASONING', value: '18ms' },
      { label: 'CONFIDENCE', value: '99.4%' },
      { label: 'BUFFER', value: '+500ml' },
    ],
  },
  radiation: {
    id: 'radiation',
    label: 'RADIATION',
    query: 'Astra, project radiation accumulation and solar energetic particle flux.',
    response: 'Daily dosimeter: 0.42 mSv (Quiet Sun). Deep space hull shielding 99.2% effective. Zero cellular anomaly risk for current transit corridor.',
    badge: 'SHIELD SECURE',
    metrics: [
      { label: 'RATE', value: '0.42 mSv/d' },
      { label: 'SOLAR EVENT', value: 'QUIET' },
      { label: 'STATUS', value: 'SAFE' },
    ],
  },
  circadian: {
    id: 'circadian',
    label: 'CIRCADIAN',
    query: 'Astra, review circadian sleep architecture and cognitive reaction speed.',
    response: 'REM & deep sleep 7.4h. Cognitive vigilance reaction 242ms (optimal). Scheduled: 30m 460nm blue spectrum light therapy at 07:00 UTC.',
    badge: 'SYNC OPTIMAL',
    metrics: [
      { label: 'SLEEP', value: '7.4h' },
      { label: 'REACTION', value: '242ms' },
      { label: 'SCHEDULE', value: '07:00' },
    ],
  },
};

export const AiChatShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTopic, setActiveTopic] = useState<'audit' | 'radiation' | 'circadian'>('audit');
  const [isTyping, setIsTyping] = useState(false);

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

  const handleSelectTopic = (topicKey: 'audit' | 'radiation' | 'circadian') => {
    if (topicKey === activeTopic) return;
    spaceAudio.playClick();
    setIsTyping(true);
    setActiveTopic(topicKey);

    setTimeout(() => {
      setIsTyping(false);
    }, 280);
  };

  const currentTopic = DEMO_TOPICS[activeTopic];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="gsap-3d-card landing-card-left group relative text-left p-5 sm:p-6 md:p-7 rounded-3xl liquid-glass-pastel-blue transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden select-text w-full hover:shadow-[0_22px_55px_-8px_rgba(59,130,246,0.32),0_0_36px_rgba(96,165,250,0.25)] hover:border-blue-300/60"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
    >
      {/* Specular Top Hairline Reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-300/80 to-transparent pointer-events-none" 
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 w-full mb-2 sm:mb-2.5">
        <div className="flex items-center gap-3">
          <div className="landing-card-icon p-2.5 rounded-2xl border border-blue-400/40 bg-blue-400/10 text-blue-300 shadow-[0_0_14px_rgba(59,130,246,0.3)] flex-shrink-0">
            <Bot className="w-5 h-5 text-blue-300 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-slate-400 uppercase font-semibold block">
              LIVE AI COPILOT • PREVIEW ONLY
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              ASTRA Assistance Demo
            </h3>
          </div>
        </div>

        {/* Neural Engine Status Pill */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/70 border border-slate-700/70 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold">AI SIMULATOR • DEMO HUD</span>
        </div>
      </div>

      {/* Live Compact ASTRA Assistant Intelligence HUD - VITAL NAVY BOX (#030519) */}
      <div className="vital-navy-box vital-data-card tilt-box relative z-10 w-full rounded-2xl border border-blue-500/30 p-3 sm:p-3.5 my-1.5 overflow-hidden shadow-inner flex flex-col justify-between min-h-[145px] sm:min-h-[155px]">
        {/* Astronaut Voice / Query Strip */}
        <div className="flex items-start gap-2 border-b border-blue-500/20 pb-2 text-[11px] font-mono">
          <div className="w-4 h-4 rounded-md bg-blue-900/60 border border-blue-400/30 flex items-center justify-center text-[9px] text-blue-300 font-bold shrink-0 mt-0.5">
            A
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">ASTRONAUT TELEMETRY QUERY</span>
            <p className="text-slate-200 font-sans italic text-xs leading-snug truncate sm:whitespace-normal">
              &ldquo;{currentTopic.query}&rdquo;
            </p>
          </div>
        </div>

        {/* AI Medical Intelligence Response */}
        <div className="my-1.5 flex items-start gap-2 text-[11px] font-mono">
          <div className="w-4 h-4 rounded-md bg-cyan-900/60 border border-cyan-400/40 flex items-center justify-center text-[9px] text-cyan-300 font-bold shrink-0 mt-0.5">
            AI
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">ASTRA REASONING ENGINE</span>
              <span className="text-[8.5px] font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                {currentTopic.badge}
              </span>
            </div>

            {isTyping ? (
              <div className="flex items-center gap-1.5 py-1 text-cyan-300 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] text-slate-400 font-mono ml-1">Analyzing biosignals...</span>
              </div>
            ) : (
              <p className="text-slate-100 font-sans text-xs leading-relaxed animate-fadeIn">
                {currentTopic.response}
              </p>
            )}
          </div>
        </div>

        {/* Micro Telemetry Metrics Footer inside Dark Navy Box */}
        <div className="flex items-center justify-between pt-1 border-t border-blue-500/15 text-[9px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            {currentTopic.metrics.map((m, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <span className="text-slate-400">{m.label}:</span>
                <strong className="text-cyan-300">{m.value}</strong>
              </span>
            ))}
          </div>
          <span className="text-emerald-400 font-bold hidden xs:inline">14.2m OVERRIDDEN</span>
        </div>
      </div>

      {/* Mode Switcher & Telemetry Metrics */}
      <div className="relative z-10 mt-2 sm:mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-blue-500/20">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase mr-1">DEMO:</span>
          {(['audit', 'radiation', 'circadian'] as const).map((topicKey) => (
            <button
              key={topicKey}
              type="button"
              onClick={() => handleSelectTopic(topicKey)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeTopic === topicKey
                  ? 'bg-blue-400 text-slate-950 shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/15'
              }`}
            >
              {DEMO_TOPICS[topicKey].label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-300">
          <span className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-white">LLaMA 3.3</span>
          </span>
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-bold text-white">AUTONOMOUS</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AiChatShowcase;
