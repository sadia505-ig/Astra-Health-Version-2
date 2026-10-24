/**
 * ASTRA Health - Timeline View
 * Chronological health events log with category filter chips and sync statuses.
 */

import React, { useState, useRef } from 'react';
import { TimelineEvent } from '../../types/mission';
import { History, Filter, CheckCircle2, AlertTriangle, Activity, Moon, Dumbbell, Sparkles, Radiation } from 'lucide-react';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  sol: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, sol }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = timeline.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RADIATION':
        return <Radiation className="w-4 h-4 text-amber-400" />;
      case 'VITALS':
        return <Activity className="w-4 h-4 text-cyan-400" />;
      case 'SLEEP':
        return <Moon className="w-4 h-4 text-purple-400" />;
      case 'EXERCISE':
        return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'ALERTS':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'CHECK_IN':
        return <CheckCircle2 className="w-4 h-4 text-blue-400" />;
      case 'AI':
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      id="timeline-view" 
      className="space-y-8 sm:space-y-12 max-w-5xl mx-auto pb-16 select-text"
      style={{ perspective: 1200 }}
    >
      
      {/* Header */}
      <div className="module-top-header tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-inner">
              <History className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                TELEMETRY LOG • SOL {sol}
              </div>
              <h2 className="text-2xl font-black font-mono text-slate-100 tracking-wider uppercase">
                MISSION HEALTH TIMELINE
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Chronological audit stream of bio-signals, check-ins, autonomous AI logs, and radiation events
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="vital-navy-box tilt-box flex items-center gap-1.5 p-1.5 rounded-2xl flex-wrap shrink-0 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 px-2 flex items-center gap-1 font-bold">
              <Filter className="w-3 h-3 text-cyan-400" /> FILTER:
            </span>
            {['ALL', 'RADIATION', 'ALERTS', 'VITALS', 'SLEEP', 'EXERCISE', 'CHECK_IN', 'AI'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />
        <div className="relative border-l-2 border-cyan-500/30 ml-4 space-y-6 sm:space-y-8 py-2">
          {filtered.map((event) => (
            <div key={event.id} className="relative pl-6">
              
              {/* Event Dot */}
              <div className="absolute -left-[9px] top-3.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_#22d3ee]">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              </div>

              {/* Event Content - VITAL NAVY BOX (#030519) */}
              <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(event.category)}
                    <span className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-semibold">
                      {event.category}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Sol {event.sol} • {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-sans mt-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
