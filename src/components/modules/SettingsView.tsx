/**
 * ASTRA Health - System Settings & Diagnostics View
 * Manages AI modes, local browser model cache, NASA API endpoints & telemetry cache,
 * offline sync queue, and hardware acceleration.
 */

import React, { useState, useEffect, useRef } from 'react';
import { AIMode } from '../../types/ai';
import { NasaConnectionStatus } from '../../types/nasa';
import { localAIManager, ModelInfo } from '../../ai/localAIManager';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';
import { 
  Settings, 
  Cpu, 
  HardDrive, 
  Wifi, 
  RefreshCw, 
  CheckCircle2, 
  Shield, 
  Download, 
  Trash2, 
  Database,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';

interface SettingsViewProps {
  aiMode: AIMode;
  onSetAiMode: (mode: AIMode) => void;
  syncPendingCount: number;
  onTriggerSync: () => void;
  nasaStatus?: NasaConnectionStatus | null;
  onClearNasaCache?: () => Promise<void>;
  onRefreshNasa?: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  aiMode,
  onSetAiMode,
  syncPendingCount,
  onTriggerSync,
  nasaStatus,
  onClearNasaCache,
  onRefreshNasa,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const [modelInfo, setModelInfo] = useState<ModelInfo>(localAIManager.getModelInfo());
  const [isSyncing, setIsSyncing] = useState(false);
  const [isClearingNasa, setIsClearingNasa] = useState(false);
  const [isRefreshingNasa, setIsRefreshingNasa] = useState(false);

  useEffect(() => {
    return localAIManager.subscribe(setModelInfo);
  }, []);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    await onTriggerSync();
    setIsSyncing(false);
  };

  const handleClearNasa = async () => {
    if (!onClearNasaCache) return;
    setIsClearingNasa(true);
    await onClearNasaCache();
    setIsClearingNasa(false);
  };

  const handleRefreshNasa = async () => {
    if (!onRefreshNasa) return;
    setIsRefreshingNasa(true);
    await onRefreshNasa();
    setIsRefreshingNasa(false);
  };

  return (
    <div 
      ref={containerRef}
      id="settings-diagnostics-view" 
      className="space-y-8 sm:space-y-12 max-w-7xl mx-auto pb-16 select-text"
      style={{ perspective: 1200 }}
    >
      
      {/* Header */}
      <div className="module-top-header tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 shadow-inner">
            <Settings className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              SYSTEM CONFIGURATION & TELEMETRY SUBSYSTEMS
            </div>
            <h2 className="text-2xl font-black font-mono text-slate-100 tracking-wider uppercase">
              SETTINGS & RUNTIME DIAGNOSTICS
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              AI router configurations, NASA API telemetry cache, on-device neural cache, and synchronization queue
            </p>
          </div>
        </div>
      </div>

      {/* 1. NASA Space Science APIs & Caching Section */}
      <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100">
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>NASA APIS & SPACE TELEMETRY CACHE</span>
          </div>
          <div className="flex items-center gap-2">
            {onRefreshNasa && (
              <button
                onClick={handleRefreshNasa}
                disabled={isRefreshingNasa}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-bold text-cyan-300 transition cursor-pointer border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingNasa ? 'animate-spin text-cyan-400' : ''}`} />
                <span>REFRESH NASA DATA</span>
              </button>
            )}
            {onClearNasaCache && (
              <button
                onClick={handleClearNasa}
                disabled={isClearingNasa}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-xs font-mono font-bold text-rose-300 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>CLEAR NASA CACHE</span>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed">
          NASA OSDR RadLab dosimetry, DONKI space weather events, and life-science research accessions are cached locally in IndexedDB with an autonomous 2-hour TTL cache to enable full flight operations during deep space communication blackouts.
        </p>

        {/* Status Grid - VITAL NAVY BOXES (#030519) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 text-xs font-mono">
          
          <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px]">NASA RadLab API</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {nasaStatus?.radLab?.toUpperCase() || 'CONNECTED'}
              </span>
            </div>
            <div className="text-xs text-slate-200 font-mono font-bold truncate">
              visualization.osdr.nasa.gov/radlab
            </div>
            <div className="text-[10px] text-slate-400">
              Dosimetry stack telemetry
            </div>
          </div>

          <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px]">NASA DONKI API</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {nasaStatus?.donki?.toUpperCase() || 'CONNECTED'}
              </span>
            </div>
            <div className="text-xs text-slate-200 font-mono font-bold truncate">
              api.nasa.gov/DONKI
            </div>
            <div className="text-[10px] text-slate-400">
              CME / SPE space weather feed
            </div>
          </div>

          <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase font-bold text-[10px]">NASA OSDR Repository</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {nasaStatus?.osdr?.toUpperCase() || 'CONNECTED'}
              </span>
            </div>
            <div className="text-xs text-slate-200 font-mono font-bold truncate">
              visualization.osdr.nasa.gov/biodata
            </div>
            <div className="text-[10px] text-slate-400">
              Space-life-sciences research
            </div>
          </div>

        </div>
      </div>

      {/* 2. AI Execution Mode Selector */}
      <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-purple shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-purple-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100 border-b border-purple-500/20 pb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>ASTRA INTELLIGENCE ROUTING MODE</span>
        </div>
        <p className="text-xs text-slate-300 font-sans">
          Select which inference engine executes your queries. The deterministic Health Engine runs locally across all modes.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-1">
          
          <div
            onClick={() => onSetAiMode('ONLINE')}
            className={`vital-navy-box vital-data-card tilt-box p-4 rounded-2xl transition cursor-pointer ${
              aiMode === 'ONLINE'
                ? 'border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.4)]'
                : 'hover:border-cyan-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-cyan-300">ONLINE (GEMINI)</span>
              {aiMode === 'ONLINE' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Proxies queries to Earth-cloud Gemini models when uplink is active.
            </p>
          </div>

          <div
            onClick={() => onSetAiMode('OFFLINE')}
            className={`vital-navy-box vital-data-card tilt-box p-4 rounded-2xl transition cursor-pointer ${
              aiMode === 'OFFLINE'
                ? 'border-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.4)]'
                : 'hover:border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-amber-300">OFFLINE (LOCAL ASTRA)</span>
              {aiMode === 'OFFLINE' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Zero network calls. Runs 100% locally in browser using Local RAG & Edge Engine.
            </p>
          </div>

          <div
            onClick={() => onSetAiMode('AUTO')}
            className={`vital-navy-box vital-data-card tilt-box p-4 rounded-2xl transition cursor-pointer ${
              aiMode === 'AUTO'
                ? 'border-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.4)]'
                : 'hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold font-mono text-emerald-300">AUTO (ADAPTIVE)</span>
              {aiMode === 'AUTO' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              Uses Gemini when online; seamlessly fails over to Local ASTRA during blackout.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Local AI Model Engine Manager */}
      <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-amber shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span>BROWSER-EDGE LOCAL AI MODEL RUNTIME</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            STATUS: {modelInfo.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 text-xs font-mono">
          <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Model Architecture</div>
            <div className="font-bold text-slate-100 text-sm mt-1">{modelInfo.name}</div>
          </div>
          <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Quantization / Size</div>
            <div className="font-bold text-slate-100 text-sm mt-1">{modelInfo.parameters}</div>
          </div>
          <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
            <div className="text-slate-400 uppercase font-bold text-[10px]">Hardware Acceleration</div>
            <div className="font-bold text-cyan-300 text-sm mt-1">
              {modelInfo.webGpuAvailable ? 'WebGPU Supported' : 'Wasm/CPU Engine'}
            </div>
          </div>
          <div className="vital-navy-box vital-data-card tilt-box p-3.5 rounded-2xl">
            <div className="text-slate-400 uppercase font-bold text-[10px]">VRAM Footprint</div>
            <div className="font-bold text-slate-100 text-sm mt-1">~{modelInfo.estimatedVRAM_MB} MB Browser Cache</div>
          </div>
        </div>

        {/* Model Actions */}
        <div className="flex items-center gap-3 pt-2">
          {modelInfo.status === 'NOT_INSTALLED' ? (
            <button
              onClick={() => localAIManager.downloadModel()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-mono font-bold text-slate-950 transition cursor-pointer shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD LOCAL WEIGHTS</span>
            </button>
          ) : modelInfo.status === 'DOWNLOADING' ? (
            <div className="w-full vital-navy-box p-4 rounded-2xl border border-amber-500/40">
              <div className="flex justify-between text-xs font-mono text-slate-200 mb-1.5 font-bold">
                <span>Downloading quantized weights into browser CacheStorage...</span>
                <span>{modelInfo.downloadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${modelInfo.downloadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" /> Weights verified & cached for 100% offline operation
              </span>
              <button
                onClick={() => localAIManager.releaseModel()}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                title="Purge model cache"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Sync Queue Telemetry */}
      <div className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-teal shadow-xl space-y-4 relative overflow-hidden transition-all duration-300">
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-300/80 to-transparent pointer-events-none" 
        />
        <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold font-mono text-slate-100">
            <RefreshCw className="w-4 h-4 text-cyan-400" />
            <span>OFFLINE SYNCHRONIZATION QUEUE</span>
          </div>
          <button
            onClick={handleSyncNow}
            disabled={syncPendingCount === 0 || isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono font-bold text-white transition disabled:opacity-40 cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>SYNC NOW</span>
          </button>
        </div>

        <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl text-xs font-mono text-slate-200">
          <div className="flex justify-between items-center">
            <span>Pending records in IndexedDB:</span>
            <strong className={`text-sm ${syncPendingCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {syncPendingCount} records waiting to synchronize
            </strong>
          </div>
        </div>
      </div>

    </div>
  );
};
