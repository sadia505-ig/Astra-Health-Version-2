/**
 * ASTRA Health - Space Health Context Card
 * Modern dashboard module providing real-time situational awareness
 * of the spaceflight environment around the astronaut's health telemetry.
 */

import React, { useState } from 'react';
import { 
  Rocket, 
  Radio, 
  Shield, 
  Activity, 
  Moon, 
  Zap, 
  Brain, 
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
  Compass
} from 'lucide-react';
import { SpaceHealthContext } from '../../services/spaceContextEngine';
import { MissionHealthBriefModal } from './MissionHealthBriefModal';
import { spaceAudio } from '../../utils/spaceAudio';

interface SpaceHealthContextCardProps {
  context: SpaceHealthContext;
  onAskAstra?: (prompt: string) => void;
  onNavigateTab?: (tab: any) => void;
}

export const SpaceHealthContextCard: React.FC<SpaceHealthContextCardProps> = ({
  context,
  onAskAstra,
  onNavigateTab,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenContext = () => {
    spaceAudio.playClick();
    setIsModalOpen(true);
  };

  const sleepStatus = context.sleepRecoveryContext.sleepDeviationHours <= -0.5
    ? 'Below recent baseline'
    : 'Within flight baseline';

  const neuralStatus = context.neuralPerformanceContext.status === 'Changing'
    ? 'Monitoring'
    : 'Within baseline';

  const commsColor = context.communicationStatus === 'ONLINE' 
    ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80' 
    : 'text-amber-400 bg-amber-950/60 border-amber-800/80';

  const sleepColor = context.sleepRecoveryContext.sleepDeviationHours <= -0.5
    ? 'text-amber-300'
    : 'text-emerald-300';

  return (
    <>
      <div 
        id="space-health-context-card"
        className="gsap-slide-box tilt-box p-5 sm:p-6 rounded-3xl liquid-glass-pastel-teal shadow-xl relative overflow-hidden font-mono flex flex-col justify-between group transition-all duration-300"
      >
        {/* Specular top hairline reflection */}
        <div 
          aria-hidden="true" 
          className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-teal-300/80 to-transparent pointer-events-none" 
        />

        {/* Card Header */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b border-teal-500/20 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-500/60 flex items-center justify-center text-teal-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100 tracking-wider uppercase">
                  SPACE HEALTH CONTEXT
                </h3>
                <p className="text-[10px] text-teal-400/90 tracking-wide">
                  Mission situational awareness & physiological context
                </p>
              </div>
            </div>

            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
              SOL {context.missionContext.sol}
            </span>
          </div>

          {/* Context Attributes Table - VITAL NAVY BOX (#030519) */}
          <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2 text-xs">
            {/* Mission Phase */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Rocket className="w-3 h-3 text-cyan-400" />
                Mission Phase
              </span>
              <span className="font-bold text-slate-200">
                {context.missionContext.missionPhase || 'Transit'}
              </span>
            </div>

            {/* Gravity */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-indigo-400" />
                Gravity
              </span>
              <span className="font-bold text-indigo-300">
                {context.astronautProfile.mission.gravityEnvironment || 'Microgravity'}
              </span>
            </div>

            {/* Radiation */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-amber-400" />
                Radiation
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-bold text-amber-300">Monitoring</span>
              </div>
            </div>

            {/* Communication */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-cyan-400" />
                Communication
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${commsColor}`}>
                {context.communicationStatus}
              </span>
            </div>

            {/* Sleep */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Moon className="w-3 h-3 text-purple-400" />
                Sleep
              </span>
              <span className={`font-bold ${sleepColor}`}>
                {sleepStatus}
              </span>
            </div>

            {/* Recovery */}
            <div className="flex items-center justify-between py-1.5 border-b border-cyan-500/15">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Recovery
              </span>
              <span className="font-bold text-slate-200">
                {context.sleepRecoveryContext.recoveryRatio}
              </span>
            </div>

            {/* Neural */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Brain className="w-3 h-3 text-pink-400" />
                Neural
              </span>
              <span className="font-bold text-emerald-300">
                {neuralStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-teal-500/20 flex items-center justify-between">
          <button
            onClick={handleOpenContext}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-950/60 hover:bg-teal-900/80 border border-teal-500/40 hover:border-teal-400 text-teal-300 hover:text-white text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group shadow-sm"
          >
            <span>VIEW CONTEXT</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Full Modal for Deep Dive */}
      <MissionHealthBriefModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        context={context}
        onAskAstra={onAskAstra}
        onNavigateTab={onNavigateTab}
      />
    </>
  );
};
