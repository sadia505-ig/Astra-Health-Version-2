import React from 'react';
import { DashboardViewModel } from '../../health/dashboardViewModel';
import { WifiOff, RefreshCw, CheckCircle, CloudUpload } from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface OfflineSyncBannerProps {
  sync: DashboardViewModel['sync'];
  isOnline: boolean;
  onTriggerSync: () => Promise<any>;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  sync,
  isOnline,
  onTriggerSync,
}) => {
  if (isOnline && sync.pendingCount === 0) {
    return null; // Nominal state
  }

  const handleSyncClick = async () => {
    spaceAudio.playSyncPing();
    await onTriggerSync();
  };

  return (
    <aside 
      id="dashboard-sync-banner"
      aria-label="Offline and Synchronization Status"
      className="gsap-slide-box tilt-box rounded-3xl p-1 liquid-glass-pastel-amber shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" 
      />
      {!isOnline ? (
        <div className="vital-navy-box vital-data-card tilt-box flex items-center justify-between gap-3 p-3.5 rounded-2xl text-amber-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-900/60 text-amber-400 border border-amber-700/60">
              <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider">
                ● OFFLINE · AUTONOMOUS COCKPIT ENGINE ACTIVE
              </div>
              <div className="text-[11px] font-sans text-amber-300/80">
                Earth communications blackout. All health algorithms, models, and telemetry logging execute safely on board.
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-700/60 uppercase font-bold shrink-0">
            {sync.pendingCount} QUEUED FOR UPLINK
          </span>
        </div>
      ) : sync.pendingCount > 0 ? (
        <div className="vital-navy-box vital-data-card tilt-box flex items-center justify-between gap-3 p-3.5 rounded-2xl text-cyan-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-cyan-900/60 text-cyan-400 border border-cyan-700/60">
              <CloudUpload className="w-4 h-4 animate-pulse shrink-0" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-wider">
                COMMUNICATION RESTORED
              </div>
              <div className="text-[11px] font-sans text-cyan-300/80">
                {sync.pendingCount} health {sync.pendingCount === 1 ? 'record' : 'records'} pending synchronization with Ground Control.
              </div>
            </div>
          </div>
          <button
            onClick={handleSyncClick}
            disabled={sync.isSyncing}
            className="space-capsule-btn space-capsule-btn-primary text-xs py-1.5 px-4 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${sync.isSyncing ? 'animate-spin' : ''}`} />
            <span>{sync.isSyncing ? 'UPLINKING...' : 'SYNC NOW'}</span>
          </button>
        </div>
      ) : null}
    </aside>
  );
};
