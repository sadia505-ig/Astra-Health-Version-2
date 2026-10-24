/**
 * ASTRA Health - Crew & Role-Based Monitoring View
 * Displays crew health overview and lets reviewers toggle between roles:
 * - Astronaut (Self-monitoring)
 * - Medical Officer (Crew triage & privacy-preserving summaries)
 * - Mission Control (Uplink / Sync telemetry)
 * - System Engineer (Offline model & DB diagnostic)
 */

import React, { useRef } from 'react';
import { CrewMember, HealthSeverity } from '../../types/health';
import { Users, ShieldCheck, Heart, Moon, ShieldAlert, AlertTriangle, AlertCircle, UserCheck } from 'lucide-react';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';

interface CrewViewProps {
  crew: CrewMember[];
  currentRole: 'Astronaut' | 'Medical Officer' | 'Mission Control' | 'Administrator';
  onSelectRole: (role: 'Astronaut' | 'Medical Officer' | 'Mission Control' | 'Administrator') => void;
  onAskAstra: (prompt: string) => void;
}

export const CrewView: React.FC<CrewViewProps> = ({
  crew,
  currentRole,
  onSelectRole,
  onAskAstra,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const getStatusBadge = (status: HealthSeverity) => {
    switch (status) {
      case 'ORANGE':
        return {
          bg: 'bg-amber-950/60 border-amber-500/60 text-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'ATTENTION',
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'MONITOR',
        };
      case 'RED':
        return {
          bg: 'bg-rose-950/60 border-rose-500/60 text-rose-200',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
          label: 'CRITICAL',
        };
      case 'GREEN':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'STABLE',
        };
    }
  };

  return (
    <div 
      ref={containerRef}
      id="crew-monitoring-view" 
      className="space-y-8 sm:space-y-12 max-w-7xl mx-auto pb-16 select-text"
      style={{ perspective: 1200 }}
    >
      
      {/* Header & Role Switcher */}
      <div className="module-top-header tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-inner">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
                CREW TELEMETRY & MULTI-ROLE SURVEILLANCE
              </div>
              <h2 className="text-2xl font-black font-mono text-slate-100 tracking-wider uppercase">
                CREW HEALTH MATRIX
              </h2>
              <p className="text-xs text-slate-300 mt-1 font-sans">
                Active mission complement physiological triage and role-based privacy boundaries
              </p>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="vital-navy-box tilt-box flex items-center gap-1.5 p-1.5 rounded-2xl flex-wrap shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 px-2 font-bold hidden lg:inline">VIEW:</span>
            {(['Astronaut', 'Medical Officer', 'Mission Control', 'Administrator'] as const).map((r) => (
              <button
                key={r}
                onClick={() => onSelectRole(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  currentRole === r
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Role Context Bar */}
      <div className="vital-navy-box tilt-box p-4 rounded-2xl text-xs font-mono text-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span>
            Current Viewing Context: <strong className="text-cyan-300 uppercase tracking-wide">{currentRole}</strong> — {
              currentRole === 'Medical Officer'
                ? 'Crew-wide readiness monitoring with autonomous triage prioritization.'
                : currentRole === 'Astronaut'
                ? 'Personal astronaut health dashboard with private subjective logging.'
                : currentRole === 'Mission Control'
                ? 'Uplink batch telemetry packet review and trend synchronization.'
                : 'System telemetry, WebGPU model status, and IndexedDB sync queue diagnostics.'
            }
          </span>
        </div>
      </div>

      {/* Crew Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
        {crew.map((member) => {
          const badge = getStatusBadge(member.status);
          const isCommander = member.id === 'sarah-chen';

          return (
            <div
              key={member.id}
              className={`gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300 ${
                isCommander && member.status === 'ORANGE'
                  ? 'border-amber-500/50'
                  : ''
              }`}
            >
              <div 
                aria-hidden="true" 
                className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
              />

              {/* Top Row: Name, Role, Status */}
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-sm font-black font-mono text-cyan-300 shadow-inner">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono text-slate-100 flex items-center gap-2">
                      <span>{member.name}</span>
                      <span className="text-xs text-slate-400 font-normal">({member.callsign})</span>
                    </h3>
                    <div className="text-xs font-mono text-cyan-400 font-bold">
                      {member.role}
                    </div>
                  </div>
                </div>

                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${badge.bg}`}>
                  {badge.icon}
                  <span>{badge.label}</span>
                </span>
              </div>

              {/* Vitals Summary Row - VITAL NAVY BOXES (#030519) */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono mb-4">
                <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" /> Resting HR
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-100 mt-1">
                    {member.restingHr} <span className="text-xs text-slate-500 font-normal">bpm</span>
                  </div>
                  <div className="text-[10px] text-cyan-400 mt-0.5">{member.keyMetricSummary}</div>
                </div>

                <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                  <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-purple-400" /> Sleep Volume
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-100 mt-1">
                    {member.sleepHours} <span className="text-xs text-slate-500 font-normal">hrs</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sol {member.lastCheckInSol} check-in</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onAskAstra(`Review crew readiness for ${member.name} (${member.role})`)}
                className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 border border-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>QUERY ASTRA ON {member.callsign.toUpperCase()}</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
