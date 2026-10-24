import React from 'react';
import { DashboardViewModel } from '../../health/dashboardViewModel';
import { Trophy, Compass, CheckCircle2, ArrowRight, Activity } from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface MissionMilestonesCardProps {
  mission: DashboardViewModel['mission'];
  onNavigateMission: () => void;
}

export const MissionMilestonesCard: React.FC<MissionMilestonesCardProps> = ({
  mission,
  onNavigateMission,
}) => {
  const handleMissionClick = () => {
    spaceAudio.playClick();
    onNavigateMission();
  };

  return (
    <section
      id="card-mission-milestones"
      aria-label="Mission Milestones and Progress"
      className="gsap-slide-box tilt-box rounded-3xl p-5 sm:p-6 liquid-glass-pastel-cyan shadow-xl relative overflow-hidden transition-all duration-300"
    >
      <div 
        aria-hidden="true" 
        className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
      />
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left Side: Mission Day & Next Milestone */}
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base" role="img" aria-label="Trophy">🏆</span>
              <h2 className="text-xs sm:text-sm font-bold font-mono tracking-widest text-slate-100 uppercase">
                MISSION MILESTONES
              </h2>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-cyan-800/70">
              MISSION DAY {mission.day} / {mission.totalDays}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-300 mb-2">
            <span className="font-semibold text-slate-100">{mission.nextMilestoneText}</span>
            <span className="font-bold text-cyan-300">{mission.percentComplete}% mission complete</span>
          </div>

          {/* Progress Bar with Glowing Head */}
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
              style={{ width: `${Math.min(100, Math.max(3, mission.percentComplete))}%` }}
            />
          </div>

          {/* Secondary stats - VITAL NAVY BOXES (#030519) */}
          <div className="flex items-center gap-3 mt-3 text-[11px] font-mono flex-wrap">
            <div className="vital-navy-box vital-data-card tilt-box px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Check-in streak: <strong className="text-emerald-300">{mission.checkInStreak} Sols</strong></span>
            </div>
            <div className="vital-navy-box vital-data-card tilt-box px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-300">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exercise compliance: <strong className="text-cyan-300">{mission.exerciseConsistencyPercent}%</strong></span>
            </div>
            <div className="vital-navy-box vital-data-card tilt-box px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-indigo-400" />
              <span>Phase: <strong className="text-indigo-300">{mission.phase}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: View Mission Details button */}
        <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <button
            onClick={handleMissionClick}
            className="w-full sm:w-auto space-capsule-btn space-capsule-btn-glass text-xs py-2.5 px-5 group"
          >
            <span>VIEW MISSION TIMELINE</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
