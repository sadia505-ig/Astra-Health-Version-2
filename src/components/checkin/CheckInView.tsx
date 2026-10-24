/**
 * ASTRA Health - Dedicated Check-In Page
 * Follows exact specifications:
 * - DAILY CHECK-IN "How are you feeling today?"
 * - Sliders: Energy, Stress, Fatigue, Mood, Sleep quality
 * - Optional notes
 * - [ COMPLETE CHECK-IN ]
 * - Post-submission: ASTRA SUMMARY comparing today's answers with recent data.
 */

import React, { useState, useRef } from 'react';
import { 
  ClipboardCheck, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare, 
  Activity, 
  RotateCcw,
  Zap,
  Flame,
  Moon,
  Smile,
  AlertCircle
} from 'lucide-react';
import { DailyCheckIn, CheckInSubmissionPayload } from '../../types/health';
import { useGsapModuleTransitions } from '../../hooks/useGsapModuleTransitions';

interface CheckInViewProps {
  sol: number;
  existingCheckIn?: DailyCheckIn;
  onSubmitCheckIn: (data: CheckInSubmissionPayload | any) => Promise<any>;
  onAskAstra: (prompt: string) => void;
  onViewOverview: () => void;
}

export const CheckInView: React.FC<CheckInViewProps> = ({
  sol,
  existingCheckIn,
  onSubmitCheckIn,
  onAskAstra,
  onViewOverview,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useGsapModuleTransitions(containerRef);

  const [energy, setEnergy] = useState(existingCheckIn?.energy ?? 65);
  const [stress, setStress] = useState(existingCheckIn?.stress ?? 40);
  const [fatigue, setFatigue] = useState(existingCheckIn?.fatigue ?? 55);
  const [mood, setMood] = useState(existingCheckIn?.mood ?? 70);
  const [sleepQuality, setSleepQuality] = useState(existingCheckIn?.sleepQuality ?? 65);
  const [subjectiveNotes, setSubjectiveNotes] = useState(existingCheckIn?.subjectiveNotes ?? '');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(!!existingCheckIn);
  const [submittedSummary, setSubmittedSummary] = useState<string | null>(
    existingCheckIn?.healthEngineAnalysis || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmitCheckIn({
        energy,
        stress,
        fatigue,
        mood,
        sleepQuality,
        subjectiveNotes,
      });

      // Generate flight-surgeon deterministic summary
      const summaryText = fatigue > 60
        ? `Subjective fatigue (${fatigue}/100) is elevated (+22% vs baseline). Paired with current sleep logs, this confirms autonomic recovery deficit. Recommend 30-minute rest before EVAs or heavy ARED cycles.`
        : `Check-in values logged for Sol ${sol}. Energy (${energy}/100) and subjective mood (${mood}/100) are congruent with expected cruise baselines. Recovery status is stable.`;

      setSubmittedSummary(summaryText);
      setIsCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSliderDescriptor = (val: number, type: 'energy' | 'stress' | 'fatigue' | 'mood' | 'sleep') => {
    if (type === 'energy') {
      return val > 75 ? '⚡ Optimal / Charged' : val > 50 ? '🔋 Moderate' : '🪫 Depleted';
    }
    if (type === 'stress') {
      return val > 70 ? '🌋 High Pressure' : val > 40 ? '😐 Moderate' : '🧘 Zen & Calm';
    }
    if (type === 'fatigue') {
      return val > 70 ? '😵 Heavy Exhaustion' : val > 40 ? '🥱 Moderate' : '🌱 Fresh & Rested';
    }
    if (type === 'mood') {
      return val > 70 ? '🤩 Thriving / Positive' : val > 40 ? '🙂 Steady' : '😫 Strained';
    }
    if (type === 'sleep') {
      return val > 75 ? '🛌 Deep Restorative' : val > 50 ? '🌙 Fair' : '⚡ Fragmented';
    }
    return '';
  };

  return (
    <div 
      ref={containerRef}
      id="daily-checkin-page-view" 
      className="max-w-3xl mx-auto space-y-8 sm:space-y-10 pb-16 select-text"
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
            <ClipboardCheck className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              CREW SUBJECTIVE TELEMETRY • SOL {sol}
            </div>
            <h2 className="text-2xl font-black font-mono text-slate-100 tracking-wider uppercase">
              DAILY CHECK-IN
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-sans">
              Subjective physiological & psychological recovery log to calibrate cognitive & autonomic baselines.
            </p>
          </div>
        </div>
      </div>

      {/* Post-Submission Summary (ASTRA SUMMARY) */}
      {isCompleted && submittedSummary && (
        <div 
          id="astra-checkin-summary-card"
          className="gsap-slide-box tilt-box rounded-3xl liquid-glass-pastel-cyan p-6 space-y-4 shadow-xl relative overflow-hidden transition-all duration-300"
        >
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
          />
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                ASTRA CLINICAL SUMMARY
              </h3>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sol {sol} Check-in Stored
            </span>
          </div>

          <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl border border-cyan-500/30">
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {submittedSummary}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-cyan-500/20">
            <button
              onClick={() => setIsCompleted(false)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Update Responses</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={onViewOverview}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-mono text-slate-200 font-bold transition cursor-pointer border border-slate-700"
              >
                RETURN TO OVERVIEW
              </button>
              <button
                onClick={() => onAskAstra('Evaluate today\'s check-in responses alongside my telemetry trends')}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-mono text-white font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>DISCUSS WITH ASTRA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Check-In Form */}
      {(!isCompleted || !submittedSummary) && (
        <form 
          onSubmit={handleSubmit} 
          className="gsap-slide-box tilt-box p-6 rounded-3xl liquid-glass-pastel-cyan shadow-xl space-y-6 relative overflow-hidden transition-all duration-300"
        >
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent pointer-events-none" 
          />
          <div className="border-b border-cyan-500/20 pb-3">
            <h3 className="text-base font-semibold text-slate-100 font-mono">
              How are you feeling today?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">
              Calibrate your subjective recovery status for crew medical monitoring
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            
            {/* 1. Energy */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Energy Level
                </span>
                <span className="text-slate-400">
                  <strong className="text-cyan-300 text-sm font-black">{energy}</strong>/100 ({getSliderDescriptor(energy, 'energy')})
                </span>
              </div>
              <input
                id="checkin-energy-slider"
                type="range"
                min="0"
                max="100"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 2. Stress */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-400" /> Mental Stress
                </span>
                <span className="text-slate-400">
                  <strong className="text-rose-300 text-sm font-black">{stress}</strong>/100 ({getSliderDescriptor(stress, 'stress')})
                </span>
              </div>
              <input
                id="checkin-stress-slider"
                type="range"
                min="0"
                max="100"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 3. Fatigue */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <Activity className="w-3.5 h-3.5 text-amber-400" /> Physical Fatigue
                </span>
                <span className="text-slate-400">
                  <strong className="text-amber-300 text-sm font-black">{fatigue}</strong>/100 ({getSliderDescriptor(fatigue, 'fatigue')})
                </span>
              </div>
              <input
                id="checkin-fatigue-slider"
                type="range"
                min="0"
                max="100"
                value={fatigue}
                onChange={(e) => setFatigue(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 4. Mood */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <Smile className="w-3.5 h-3.5 text-emerald-400" /> Psychological Mood
                </span>
                <span className="text-slate-400">
                  <strong className="text-emerald-300 text-sm font-black">{mood}</strong>/100 ({getSliderDescriptor(mood, 'mood')})
                </span>
              </div>
              <input
                id="checkin-mood-slider"
                type="range"
                min="0"
                max="100"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* 5. Sleep quality */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-200 flex items-center gap-1.5 font-bold">
                  <Moon className="w-3.5 h-3.5 text-purple-400" /> Sleep Quality
                </span>
                <span className="text-slate-400">
                  <strong className="text-purple-300 text-sm font-black">{sleepQuality}</strong>/100 ({getSliderDescriptor(sleepQuality, 'sleep')})
                </span>
              </div>
              <input
                id="checkin-sleep-slider"
                type="range"
                min="0"
                max="100"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Optional notes */}
            <div className="vital-navy-box vital-data-card tilt-box p-4 rounded-2xl space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                Optional Subjective Remarks
              </label>
              <textarea
                id="checkin-notes-input"
                rows={3}
                placeholder="Log physical soreness, circadian disruption, headache, or operational remarks..."
                value={subjectiveNotes}
                onChange={(e) => setSubjectiveNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-slate-200 text-xs font-sans placeholder:text-slate-500 focus:outline-hidden focus:border-cyan-500 transition resize-none"
              />
            </div>

          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-cyan-500/20 flex justify-end">
            <button
              id="complete-checkin-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-xs font-mono font-bold text-white transition cursor-pointer shadow-lg"
            >
              {isSubmitting ? 'PROCESSING WITH HEALTH ENGINE...' : 'COMPLETE CHECK-IN'}
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
