/**
 * ASTRA Health - "Why ASTRA is Watching" Card
 * Explainable surveillance module showing the exact, real telemetry factors
 * currently being monitored by ASTRA. Zero fabricated observations.
 */

import React, { useState } from 'react';
import { 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  Activity, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SpaceHealthContext, getWhyAstraIsWatching, WhyWatchingFactor } from '../../services/spaceContextEngine';
import { spaceAudio } from '../../utils/spaceAudio';

interface WhyAstraIsWatchingCardProps {
  context: SpaceHealthContext;
  onAskAstra?: (prompt: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const WhyAstraIsWatchingCard: React.FC<WhyAstraIsWatchingCardProps> = ({
  context,
  onAskAstra,
  onNavigateTab,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const factors = getWhyAstraIsWatching(context);

  const toggleDetails = () => {
    spaceAudio.playClick();
    setShowDetails(prev => !prev);
  };

  const getSeverityBullet = (severity: WhyWatchingFactor['severity']) => {
    switch (severity) {
      case 'ORANGE':
        return 'text-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]';
      case 'YELLOW':
        return 'text-amber-300';
      case 'BLUE':
        return 'text-cyan-400';
      case 'GREEN':
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div 
      id="why-astra-is-watching-card"
      className="gsap-slide-box tilt-box p-5 sm:p-6 rounded-3xl liquid-glass-pastel-amber shadow-xl relative overflow-hidden font-mono flex flex-col justify-between group transition-all duration-300"
    >
      {/* Specular top hairline reflection */}
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" 
      />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-amber-500/20 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-100 tracking-wider uppercase">
                WHY ASTRA IS WATCHING
              </h3>
              <p className="text-[10px] text-amber-400/90 tracking-wide font-sans">
                Transparent telemetry surveillance factors
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 font-bold">
            {factors.length} ACTIVE FACTOR{factors.length === 1 ? '' : 'S'}
          </span>
        </div>

        {/* Dynamic Observations Bullet List - VITAL NAVY BOX (#030519) */}
        <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2 text-xs">
          {factors.map((factor) => (
            <div key={factor.id} className="group/item py-1 border-b border-slate-800/80 last:border-b-0">
              <div className="flex items-start gap-2.5">
                <span className={`text-base leading-none select-none ${getSeverityBullet(factor.severity)}`}>
                  ●
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-slate-200 tracking-wide">
                    {factor.text}
                  </span>
                  {showDetails && (
                    <p className="text-[11px] text-slate-300 font-sans mt-1 leading-relaxed bg-slate-950/90 p-2.5 rounded-xl border border-amber-500/20">
                      {factor.detail}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & Toggle Details */}
      <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between gap-2">
        <button
          onClick={toggleDetails}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 hover:text-white text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>{showDetails ? 'HIDE DETAILS' : 'VIEW DETAILS'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {onAskAstra && (
          <button
            onClick={() => onAskAstra('What health indicators are ASTRA watching and why?')}
            className="py-2 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center gap-1"
            title="Ask ASTRA about these monitored factors"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">ASK ASTRA</span>
          </button>
        )}
      </div>
    </div>
  );
};
