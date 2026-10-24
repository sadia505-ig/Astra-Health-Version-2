import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Rocket, 
  Settings as SettingsIcon,
  Eye,
  Crosshair
} from 'lucide-react';
import { useParallax } from '../../hooks/useParallax';
import { useGsapLandingAnimations } from '../../hooks/useGsapLandingAnimations';
import { ConnectionState } from '../../services/connectivityManager';
import { AIMode, AISource } from '../../types/ai';
import { HealthEngineOutput } from '../../health/healthEngine';
import { MissionContext } from '../../types/mission';
import { DailyCheckIn } from '../../types/health';
import { calculatePhysicalHealthIndex, calculateMentalHealthIndex } from '../../health/healthIndexes';
import { AstraHealthWelcomeBanner } from '../common/AstraHealthWelcomeBanner';
import { BioSignalFeaturedCard } from './BioSignalFeaturedCard';
import { BioSignalEcgShowcase } from './BioSignalEcgShowcase';
import { NeuralSignalFeaturedCard } from './NeuralSignalFeaturedCard';
import { NeuralBrainwaveShowcase } from './NeuralBrainwaveShowcase';
import { HealthDashboardFeaturedCard } from './HealthDashboardFeaturedCard';
import { HealthDashboardDemoShowcase } from './HealthDashboardDemoShowcase';
import { AIAssistanceFeaturedCard } from './AIAssistanceFeaturedCard';
import { AiChatShowcase } from './AiChatShowcase';
import { ActiveModuleType } from './CentralMissionCore';
import { OrbitalSystem } from './OrbitalSystem';
import { MissionThought } from './MissionThought';
import { spaceAudio } from '../../utils/spaceAudio';
import { getAstronautProfile, subscribeToProfile, getGreeting } from '../../services/profileService';

interface LandingViewProps {
  missionContext: MissionContext;
  connectionState: ConnectionState;
  aiMode: AIMode;
  activeAiSource: AISource;
  healthEngineOutput: HealthEngineOutput;
  unacknowledgedAlertsCount: number;
  todayCheckIn?: DailyCheckIn;
  onStartCheckIn: () => void;
  onReviewCheckIn: () => void;
  onUpdateCheckIn: () => void;
  onNavigatePhysical: () => void;
  onNavigateMental: () => void;
  onNavigateDashboard: () => void;
  onNavigateAI: () => void;
  onNavigateSettings?: () => void;
  onNavigateMission?: () => void;
  onOpenCommandMenu?: () => void;
  onNavigateProfile?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  missionContext,
  connectionState,
  aiMode,
  activeAiSource,
  healthEngineOutput,
  unacknowledgedAlertsCount,
  todayCheckIn,
  onStartCheckIn,
  onReviewCheckIn,
  onUpdateCheckIn,
  onNavigatePhysical,
  onNavigateMental,
  onNavigateDashboard,
  onNavigateAI,
  onNavigateSettings,
  onNavigateMission,
  onOpenCommandMenu,
  onNavigateProfile,
}) => {
  const [profile, setProfile] = useState(() => getAstronautProfile());

  useEffect(() => {
    return subscribeToProfile(setProfile);
  }, []);
  const [hoveredModule, setHoveredModule] = useState<ActiveModuleType>(null);
  const { offset: parallaxOffset, prefersReducedMotion } = useParallax(1);
  const landingContainerRef = useRef<HTMLDivElement>(null);

  // Initialize GSAP 3D transitions, scroll effect, and perspective animations
  useGsapLandingAnimations(landingContainerRef);

  const isOffline = connectionState === 'COMMS_BLACKOUT' || aiMode === 'OFFLINE';

  // Real data-driven indices from actual health telemetry
  const physicalScore = calculatePhysicalHealthIndex({
    current: healthEngineOutput.currentMeasurement,
    baselines: healthEngineOutput.baselines,
  });

  const mentalScore = calculateMentalHealthIndex({
    current: healthEngineOutput.currentMeasurement,
    baselines: healthEngineOutput.baselines,
  });

  const aiStatusLabel = isOffline 
    ? 'LOCAL LLaMA' 
    : activeAiSource.includes('GEMINI') 
    ? 'GEMINI 2.5' 
    : 'AI READY';

  const dashboardLabel = healthEngineOutput.whatChangedList.length > 0
    ? `${healthEngineOutput.whatChangedList.length} CHANGES`
    : 'NOMINAL';

  return (
    <div 
      ref={landingContainerRef}
      id="astra-space-landing-hub"
      className="relative min-h-[calc(100vh-120px)] flex flex-col justify-between overflow-x-clip px-4 py-3 sm:py-4 max-w-7xl mx-auto w-full select-text"
      style={{ perspective: 1200 }}
    >
      {/* ============================================================ */}
      {/* 1. TOP MISSION IDENTITY STRIP                                */}
      {/* ============================================================ */}
      <header id="landing-identity-strip" className="relative z-20 w-full flex items-center justify-between text-left">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black font-mono tracking-widest text-slate-100 uppercase">
              ASTRA HEALTH
            </h1>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-cyan-300 bg-white/10 border border-white/25 px-2.5 py-0.5 rounded-full uppercase shadow-[0_2px_10px_rgba(6,182,212,0.2)]">
              COMMAND HUB
            </span>
          </div>
          <p className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
            <span className="text-cyan-300 font-bold">{getGreeting(profile)}</span> • DEEP SPACE AUTONOMY
          </p>
        </div>
      </header>

      {/* ============================================================ */}
      {/* 2. WELCOMING BANNER, INSPIRATIONAL REFLECTION, & TELEMETRY   */}
      {/* ============================================================ */}
      <div 
        className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 pt-2 pb-10 space-y-14 sm:space-y-20 lg:space-y-28"
      >
        {/* Upper Disappearing Hero: Welcome Banner + Reflection Capsule */}
        <div id="landing-upper-hero" className="w-full space-y-5 sm:space-y-7 pb-2 sm:pb-4">
          {/* 1. AstraHealth Welcome Banner */}
          <AstraHealthWelcomeBanner variant="landing" />

          {/* 2. Inspirational Reflection Capsule (Under AstraHealth & Before Bio Signal) */}
          <div className="w-full flex justify-center py-2 sm:py-3">
            <MissionThought 
              sol={missionContext.sol} 
              metDays={missionContext.metDays} 
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. BIO SIGNAL STATION & REAL-TIME ECG MONITOR                */}
        {/* Bio Signal card jumps from LEFT, ECG animation from RIGHT    */}
        {/* ============================================================ */}
        <section 
          aria-label="Bio Signal Station"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-14 xl:gap-16 w-full items-stretch"
        >
          <BioSignalFeaturedCard
            currentMeasurement={healthEngineOutput.currentMeasurement}
            physicalScore={physicalScore}
            onHoverStart={setHoveredModule}
            onHoverEnd={() => setHoveredModule(null)}
            onClick={onNavigatePhysical}
            onEnterCheckup={onNavigatePhysical}
            onStartCheckIn={onStartCheckIn}
          />
          <BioSignalEcgShowcase />
        </section>

        {/* ============================================================ */}
        {/* 2. NEURAL SIGNAL STATION & SYNAPTIC BRAINWAVE MATRIX         */}
        {/* Placed under Bio Signal! Neural Signal jumps from RIGHT!     */}
        {/* Neural animation jumps from LEFT, Card jumps from RIGHT      */}
        {/* ============================================================ */}
        <section 
          aria-label="Neural Signal Station"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-14 xl:gap-16 w-full items-stretch"
        >
          <div className="order-2 lg:order-1 flex w-full">
            <NeuralBrainwaveShowcase />
          </div>
          <div className="order-1 lg:order-2 flex w-full">
            <NeuralSignalFeaturedCard
              currentMeasurement={healthEngineOutput.currentMeasurement}
              mentalScore={mentalScore}
              onHoverStart={setHoveredModule}
              onHoverEnd={() => setHoveredModule(null)}
              onClick={onNavigateMental}
              onEnterCheckup={onNavigateMental}
              onStartCheckIn={onStartCheckIn}
            />
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. HEALTH DASHBOARD & LIVE MISSION COMMAND HUD SHOWCASE      */}
        {/* Placed under Neural Signal! Card jumps from LEFT,            */}
        {/* Live dashboard demo jumps from RIGHT                         */}
        {/* ============================================================ */}
        <section 
          aria-label="Health Dashboard Station"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-14 xl:gap-16 w-full items-stretch"
        >
          <HealthDashboardFeaturedCard
            currentMeasurement={healthEngineOutput.currentMeasurement}
            whatChangedCount={healthEngineOutput.whatChangedList.length}
            dashboardLabel={dashboardLabel}
            onHoverStart={setHoveredModule}
            onHoverEnd={() => setHoveredModule(null)}
            onClick={onNavigateDashboard}
            onEnterCheckup={onNavigateDashboard}
          />
          <HealthDashboardDemoShowcase />
        </section>

        {/* ============================================================ */}
        {/* 4. TACTICAL AI ASSISTANCE & AUTONOMOUS MEDICAL CHAT STREAM   */}
        {/* Placed under Health Dashboard! AI card jumps from RIGHT,     */}
        {/* Moving chatbox jumps from LEFT                               */}
        {/* ============================================================ */}
        <section 
          aria-label="AI Assistance Station"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-14 xl:gap-16 w-full items-stretch"
        >
          <div className="order-2 lg:order-1 flex w-full">
            <AiChatShowcase />
          </div>
          <div className="order-1 lg:order-2 flex w-full">
            <AIAssistanceFeaturedCard
              isOffline={isOffline}
              activeAiSource={activeAiSource}
              aiStatusLabel={aiStatusLabel}
              onHoverStart={setHoveredModule}
              onHoverEnd={() => setHoveredModule(null)}
              onClick={onNavigateAI}
              onEnterCheckup={onNavigateAI}
            />
          </div>
        </section>
      </div>

      {/* ============================================================ */}
      {/* 3. WIDE SPATIAL MATRIX - UNOBSTRUCTED EARTH OBSERVATION      */}
      {/* ============================================================ */}
      <div 
        data-scroll 
        data-scroll-speed="0.12"
        className="relative z-20 flex flex-col items-center justify-center w-full my-8 sm:my-12 py-3"
      >
        
        {/* Orbital System Lines & Nodes (Background overlay) */}
        <OrbitalSystem
          activeHoverModule={hoveredModule}
          parallaxOffset={parallaxOffset}
          prefersReducedMotion={prefersReducedMotion}
        />

        {/* Central Observation Reticle (Cleanly framed behind the orbital console) */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="gsap-earth-window-reticle w-56 h-56 sm:w-64 sm:h-64 rounded-full border border-sky-400/20 flex items-center justify-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-sky-400/25 animate-spin" style={{ animationDuration: '60s' }} />
          </div>
        </div>

        {/* Cohesive Orbital Observation & Mission Console */}
        <div className="flex flex-col items-center gap-3 sm:gap-3.5 relative z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25 text-[11px] font-mono text-slate-200 shadow-[0_4px_20px_rgba(56,189,248,0.2)]">
            <Crosshair className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span className="tracking-widest uppercase">EARTH ORBITAL OBSERVATION WINDOW</span>
          </div>

          {/* Center Mission Actions Console - placed directly below with harmonious spacing */}
          <div className="flex items-center justify-center gap-3">
            {onNavigateMission && (
              <button
                id="landing-quick-mission-btn"
                onClick={() => {
                  spaceAudio.playQuindar();
                  onNavigateMission();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-500/15 hover:bg-purple-500/30 text-purple-200 hover:text-white border border-purple-300/40 hover:border-purple-200 font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_4px_16px_rgba(168,85,247,0.25)]"
              >
                <Rocket className="w-4 h-4 text-purple-300" />
                <span>MISSION APIS</span>
              </button>
            )}

            {onNavigateSettings && (
              <button
                id="landing-quick-settings-btn"
                onClick={() => {
                  spaceAudio.playQuindar();
                  onNavigateSettings();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-300/40 hover:border-amber-200 font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
              >
                <SettingsIcon className="w-4 h-4 text-amber-300" />
                <span>SETTINGS</span>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* 4. MINIMAL SPATIAL STATUS FOOTER                              */}
      {/* ============================================================ */}
      <footer className="relative z-20 w-full pt-2 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] font-mono text-slate-500 border-t border-slate-800/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>AUTONOMOUS CREW HEALTH MONITORING</span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400">TOUCH & TELEMETRY ACTIVE</span>
        </div>

        <div className="flex items-center gap-2.5 text-slate-400">
          <span>MISSION MARS-01</span>
          <span className="text-slate-700">•</span>
          <span className="text-cyan-400 font-semibold">ASTRA v2.4</span>
        </div>
      </footer>

    </div>
  );
};

export default LandingView;
