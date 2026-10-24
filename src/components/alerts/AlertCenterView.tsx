/**
 * ASTRA Health - Alert Center View
 * NASA Mission Control & Flight Surgeon Alert Triage:
 * Top: ALERTS with [ ALL ] [ MONITOR ] [ ATTENTION ] [ CRITICAL ]
 * Clean cards without distracting warning animations or overwhelming red.
 */

import React, { useState, useRef } from 'react';
import { HealthAlert, HealthSeverity } from '../../types/health';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';
import { 
  BellRing, 
  Check, 
  MessageSquare, 
  Database, 
  ShieldAlert, 
  AlertTriangle, 
  AlertCircle, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AlertCenterViewProps {
  alerts: HealthAlert[];
  sol: number;
  onAcknowledge: (alertId: string) => Promise<void>;
  onAskAstra: (prompt: string) => void;
  onViewData: () => void;
}

type AlertFilter = 'ALL' | 'MONITOR' | 'ATTENTION' | 'CRITICAL';

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  alerts,
  sol,
  onAcknowledge,
  onAskAstra,
  onViewData,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const [selectedFilter, setSelectedFilter] = useState<AlertFilter>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(a => {
    if (selectedFilter === 'ALL') return true;
    if (selectedFilter === 'CRITICAL') return a.severity === 'RED';
    if (selectedFilter === 'ATTENTION') return a.severity === 'ORANGE';
    if (selectedFilter === 'MONITOR') return a.severity === 'YELLOW';
    return true;
  });

  const handleAck = async (id: string) => {
    setAcknowledgingId(id);
    await onAcknowledge(id);
    setAcknowledgingId(null);
  };

  const getBadge = (severity: HealthSeverity) => {
    switch (severity) {
      case 'RED':
        return {
          bg: 'bg-rose-950/70 border-rose-600/70 text-rose-300',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
          label: 'CRITICAL',
        };
      case 'ORANGE':
        return {
          bg: 'bg-amber-950/70 border-amber-600/70 text-amber-200',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'ATTENTION',
        };
      case 'YELLOW':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'MONITOR',
        };
      case 'GREEN':
      default:
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'NORMAL',
        };
    }
  };

  return (
    <div 
      ref={containerRef}
      id="alert-center-view" 
      className="space-y-8 sm:space-y-12 pb-16 max-w-7xl mx-auto select-text"
      style={{ perspective: 1200 }}
    >
      
      {/* Header & Clean Filters: [ ALL ] [ MONITOR ] [ ATTENTION ] [ CRITICAL ] */}
      <div className="module-top-header tilt-box p-6 rounded-3xl liquid-glass-pastel-rose shadow-xl relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400 uppercase tracking-widest mb-1.5">
              <BellRing className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>FLIGHT SURGEON & SAFETY BUS • SOL {sol}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono text-slate-100 tracking-wider uppercase">
              MISSION HEALTH ALERTS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-sans">
              Deterministic health engine triggers, circadian drift alarms, and automated baseline anomaly triage.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="vital-navy-box tilt-box flex items-center gap-1.5 p-1.5 rounded-2xl flex-wrap shrink-0 shadow-inner">
            {(['ALL', 'MONITOR', 'ATTENTION', 'CRITICAL'] as const).map((filter) => (
              <button
                key={filter}
                id={`alert-filter-${filter.toLowerCase()}`}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                  selectedFilter === filter
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Alert Cards List */}
      {filteredAlerts.length === 0 ? (
        <div className="p-8 rounded-3xl liquid-glass-pastel-rose text-center text-slate-300 font-mono text-xs">
          No active alerts matching '{selectedFilter}'. All telemetry tracking within nominal baseline boundaries.
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {filteredAlerts.map((alert) => {
            const badge = getBadge(alert.severity);
            const isExpanded = expandedId === alert.id;

            return (
              <div
                key={alert.id}
                id={`alert-card-${alert.id}`}
                className="gsap-slide-box tilt-box rounded-3xl liquid-glass-pastel-rose p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300"
              >
                <div 
                  aria-hidden="true" 
                  className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300/80 to-transparent pointer-events-none" 
                />
                
                {/* Top Row: Severity Badge, Title, Sol & Time */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-3 border-b border-rose-500/20">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${badge.bg}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        Sol {alert.sol}
                      </span>
                      {alert.acknowledged && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                          ACKNOWLEDGED
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
                      {alert.title}
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5 self-start">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Detected: <strong className="text-slate-300">Sol {alert.sol}, 08:42 UTC</strong></span>
                  </div>
                </div>

                {/* Key Contributing Metrics Summary */}
                <div className="my-3 space-y-2">
                  <div className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                    {alert.message}
                  </div>

                  {/* VITAL NAVY BOXES FOR ASTRONAUT TELEMETRY / VITAL ANOMALIES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
                    <div className="vital-navy-box vital-data-card tilt-box p-3 rounded-2xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                        CONTRIBUTING METRICS
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {alert.contributingFactors.map((f, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-200 text-xs">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="vital-navy-box vital-data-card tilt-box p-3 rounded-2xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">
                        COMPARED WITH
                      </span>
                      <span className="text-slate-200 font-bold">
                        {alert.baselineComparison || 'Personal 14-day rolling baseline'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-rose-500/20 space-y-2.5 text-xs font-sans">
                    <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                      <span className="font-mono text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        TRIGGER RATIONALE
                      </span>
                      <p className="text-slate-200 font-mono text-xs">
                        {alert.triggerRationale}
                      </p>
                    </div>

                    <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
                      <span className="font-mono text-[10px] text-cyan-300 uppercase font-bold block mb-1">
                        RECOMMENDED MONITORING PROTOCOL
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed">
                        {alert.recommendedNextStep}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions Row */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                    className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'HIDE DETAILS' : 'VIEW DETAILS'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskAstra(`Explain alert: "${alert.title}" and recommended actions`)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>ASK ASTRA</span>
                    </button>

                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAck(alert.id)}
                        disabled={acknowledgingId === alert.id}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Check className="w-3 h-3" />
                        <span>{acknowledgingId === alert.id ? 'LOGGING...' : 'ACKNOWLEDGE'}</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
