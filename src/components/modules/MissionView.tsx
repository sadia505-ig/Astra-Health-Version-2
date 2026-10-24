/**
 * ASTRA Health - Mission Context View
 * Displays MARS-01 mission parameters, light delay (14.2 min), ECLSS environmental life support data,
 * NASA RadLab environment context, and NASA OSDR research reference links.
 */

import React, { useState, useRef } from 'react';
import { MissionContext } from '../../types/mission';
import { NasaRadiationContext, NasaSpaceWeatherEvent, NasaResearchItem } from '../../types/nasa';
import { NasaResearchView } from './NasaResearchView';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';
import { 
  Compass, 
  Radio, 
  Users, 
  Moon, 
  Dumbbell, 
  Shield, 
  Gauge, 
  Sun, 
  Activity, 
  BookOpen, 
  Bot, 
  Sparkles,
  Layers,
  Thermometer,
  Wind
} from 'lucide-react';

interface MissionViewProps {
  mission: MissionContext;
  nasaRadiation?: NasaRadiationContext | null;
  nasaSpaceWeather?: NasaSpaceWeatherEvent[];
  nasaResearch?: NasaResearchItem[];
  onAskAstra: (prompt: string) => void;
}

export const MissionView: React.FC<MissionViewProps> = ({ 
  mission, 
  nasaRadiation,
  nasaSpaceWeather = [],
  nasaResearch = [],
  onAskAstra 
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const [activeTab, setActiveTab] = useState<'FLIGHT' | 'RESEARCH'>('FLIGHT');

  return (
    <div 
      ref={containerRef}
      id="mission-context-view" 
      className="space-y-8 sm:space-y-12 max-w-7xl mx-auto pb-16 select-text"
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
              <Compass className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                  INTERPLANETARY TRAJECTORY • SOL {mission.sol}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  DEEP SPACE CRUISE
                </span>
              </div>
              <h2 className="text-2xl font-black font-mono text-slate-100 tracking-wider uppercase">
                MISSION CONTEXT • {mission.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Interplanetary trajectory, Deep Space Network (DSN) latency, habitat life support, and NASA space science data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Subtabs */}
            <div className="vital-navy-box tilt-box flex items-center gap-1.5 p-1.5 rounded-2xl shadow-inner">
              <button
                onClick={() => setActiveTab('FLIGHT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  activeTab === 'FLIGHT'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Gauge className="w-3.5 h-3.5" />
                <span>FLIGHT & ECLSS</span>
              </button>
              <button
                onClick={() => setActiveTab('RESEARCH')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  activeTab === 'RESEARCH'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>NASA RESEARCH ({nasaResearch.length})</span>
              </button>
            </div>

            <button
              onClick={() => onAskAstra('Explain the mission communication delay and how ASTRA supports crew autonomy during blackouts.')}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 transition cursor-pointer border border-slate-700"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>ASK ASTRA</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'FLIGHT' && (
        <div className="space-y-8 sm:space-y-10">
          {/* Flight Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold"><Compass className="w-3.5 h-3.5 text-cyan-400" /> Mission Sol</span>
                <span className="text-cyan-400 font-bold">MET {mission.metDays}D</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100 mt-1">
                Sol {mission.sol}
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">Phase: {mission.missionPhase}</div>
            </div>

            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold"><Radio className="w-3.5 h-3.5 text-amber-400" /> DSN Light Delay</span>
                <span className="text-amber-400 font-bold">One-Way</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
                {mission.earthCommsDelayMinutes} <span className="text-xs text-slate-400 font-normal">min</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">Round-trip latency: ~28.4 min</div>
            </div>

            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold"><Users className="w-3.5 h-3.5 text-emerald-400" /> Crew Complement</span>
                <span className="text-emerald-400 font-bold">Nominal</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-slate-100 mt-1">
                {mission.crewCount} <span className="text-xs text-slate-400 font-normal">Astronauts</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">Commander, Pilot, Eng, Specialist</div>
            </div>

            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span className="flex items-center gap-1.5 font-bold"><Shield className="w-3.5 h-3.5 text-purple-400" /> NASA RadLab Ambient</span>
                <span className="text-purple-400 font-bold">RAD Suite</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-purple-300 mt-1">
                {nasaRadiation?.absorbedDoseRate || 482.4} <span className="text-xs text-slate-400 font-normal">µGy/d</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 mt-1">GCR & Solar Minimum Baseline</div>
            </div>

          </div>

          {/* Environmental Life Support System (ECLSS) Telemetry */}
          <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-teal shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
            <div 
              aria-hidden="true" 
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-300/80 to-transparent pointer-events-none" 
            />
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>HABITAT LIFE SUPPORT (ECLSS) ATMOSPHERIC TELEMETRY</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                ALL SUBSYSTEMS GREEN
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6">
              <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Cabin CO2 Partial Pressure</div>
                <div className="text-xl font-black font-mono text-slate-100 mt-1">0.32 <span className="text-xs text-slate-500">kPa</span></div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">Nominal (&lt;0.40 kPa)</div>
              </div>

              <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Habitat Cabin Pressure</div>
                <div className="text-xl font-black font-mono text-slate-100 mt-1">101.3 <span className="text-xs text-slate-500">kPa</span></div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">1.00 atm Standard</div>
              </div>

              <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Oxygen Partial Concentration</div>
                <div className="text-xl font-black font-mono text-slate-100 mt-1">21.0%</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1 font-semibold">Nominal O2 balance</div>
              </div>

              <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Cabin Temperature & Humidity</div>
                <div className="text-xl font-black font-mono text-slate-100 mt-1">21.4°C <span className="text-xs text-slate-500">/ 48%</span></div>
                <div className="text-[10px] font-mono text-cyan-400 mt-1 font-semibold">Optimal Comfort Band</div>
              </div>
            </div>
          </div>

          {/* NASA Space Weather Status Banner */}
          <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-amber shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
            <div 
              aria-hidden="true" 
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" 
            />
            <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>NASA DONKI SPACE WEATHER SYNOPSIS</span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Source: NASA DONKI Stream
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">Recent Solar Events</div>
                <div className="text-slate-100 font-bold text-sm">
                  {nasaSpaceWeather.length > 0 
                    ? `${nasaSpaceWeather[0].type} (${nasaSpaceWeather[0].eventID}) logged`
                    : 'Solar surface quiet. No high-energy SPE events.'}
                </div>
                <div className="text-slate-400 text-xs font-mono">
                  {nasaSpaceWeather[0]?.note?.slice(0, 90) || 'Interplanetary magnetic field nominal.'}...
                </div>
              </div>

              <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-1">
                <div className="text-slate-400 font-mono text-[10px] uppercase font-bold">Radiation Telemetry Link</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">
                  NASA RADLAB • {nasaRadiation?.dataStatus?.toUpperCase() || 'CACHED'}
                </div>
                <div className="text-slate-400 text-xs font-mono">
                  Absorbed dose: {nasaRadiation?.absorbedDoseRate || 482.4} µGy/day
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'RESEARCH' && (
        <NasaResearchView
          researchList={nasaResearch}
          onAskAstra={onAskAstra}
        />
      )}

    </div>
  );
};
