import React from 'react';
import { DashboardViewModel } from '../../health/dashboardViewModel';
import { 
  BellRing, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight
} from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface DashboardAlertsRemindersProps {
  alerts: DashboardViewModel['alerts'];
  onNavigateModule: (module: 'CARDIO' | 'RECOVERY' | 'TRENDS' | 'ALERTS' | 'COGNITIVE') => void;
}

export const DashboardAlertsReminders: React.FC<DashboardAlertsRemindersProps> = ({
  alerts,
  onNavigateModule,
}) => {
  const handleAlertClick = (targetModule: 'CARDIO' | 'RECOVERY' | 'TRENDS' | 'ALERTS' | 'COGNITIVE') => {
    spaceAudio.playClick();
    onNavigateModule(targetModule);
  };

  const getSeverityBadge = (severityLabel: DashboardViewModel['alerts'][0]['severityLabel']) => {
    switch (severityLabel) {
      case 'CRITICAL':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />,
          label: 'CRITICAL',
          badgeClass: 'bg-rose-950/70 border-rose-700/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
          dotClass: 'bg-rose-500 animate-pulse',
        };
      case 'ATTENTION':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          label: 'ATTENTION',
          badgeClass: 'bg-amber-950/70 border-amber-700/80 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
          dotClass: 'bg-amber-500 animate-pulse',
        };
      case 'MONITOR':
        return {
          icon: <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />,
          label: 'MONITOR',
          badgeClass: 'bg-amber-950/50 border-amber-800/60 text-amber-300',
          dotClass: 'bg-amber-400',
        };
      case 'REMINDER':
        return {
          icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
          label: 'REMINDER',
          badgeClass: 'bg-cyan-950/50 border-cyan-800/60 text-cyan-300',
          dotClass: 'bg-cyan-400',
        };
      case 'NORMAL':
      default:
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          label: 'NORMAL',
          badgeClass: 'bg-emerald-950/50 border-emerald-800/60 text-emerald-300',
          dotClass: 'bg-emerald-400',
        };
    }
  };

  return (
    <section 
      id="dashboard-alerts-reminders"
      aria-label="Alerts and Reminders"
      className="gsap-slide-box tilt-box p-5 sm:p-6 rounded-3xl liquid-glass-pastel-rose shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-rose-300/80 to-transparent pointer-events-none" 
      />

      <div className="flex items-center justify-between gap-3 mb-3 border-b border-rose-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
          <h2 className="text-sm sm:text-base font-bold font-mono tracking-widest text-slate-100 uppercase">
            ALERTS & REMINDERS
          </h2>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/70 font-bold">
          {alerts.length} ACTIVE {alerts.length === 1 ? 'NOTIFICATION' : 'NOTIFICATIONS'}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="vital-navy-box vital-data-card tilt-box flex items-center gap-2.5 p-4 rounded-2xl text-emerald-300 text-xs font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-bold">ALL SYSTEMS NOMINAL:</span>
          <span>No active health alerts or urgent operational reminders.</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.map((alert) => {
            const sev = getSeverityBadge(alert.severityLabel);
            return (
              <button
                key={alert.id}
                onClick={() => handleAlertClick(alert.targetModule)}
                className="vital-navy-box vital-data-card tilt-box w-full flex items-start justify-between p-4 rounded-2xl text-left transition-all group cursor-pointer border border-cyan-500/30 hover:border-cyan-400/80"
              >
                <div className="flex items-start gap-2.5 min-w-0 pr-2">
                  <div className="mt-0.5">{sev.icon}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold font-mono text-slate-100 group-hover:text-cyan-300 transition">
                        {alert.title}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/60 border border-white/10">
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dotClass}`} />
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                      {alert.message}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-1 transition-transform mt-1">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
