import React, { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { 
  getSessionMissionThought, 
  cycleMissionThought, 
  subscribeToMissionThought 
} from '../../services/missionThoughtService';
import { MissionThought as MissionThoughtType } from '../../data/missionThoughts';

interface MissionThoughtProps {
  sol?: number;
  metDays?: number;
}

const ROTATION_INTERVAL_MS = 8500; // 8.5s dynamic rotation
const FADE_DURATION_MS = 450;

export const MissionThought: React.FC<MissionThoughtProps> = () => {
  // Current active reflection
  const [thought, setThought] = useState<MissionThoughtType>(() => getSessionMissionThought());
  const [isFading, setIsFading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // System prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Smoothly transition to the next reflection
  const transitionToNext = useCallback((playSound: boolean = false) => {
    if (reducedMotion) {
      const next = cycleMissionThought(playSound);
      setThought(next);
      return;
    }

    setIsFading(true);
    setTimeout(() => {
      const next = cycleMissionThought(playSound);
      setThought(next);
      setIsFading(false);
    }, FADE_DURATION_MS);
  }, [reducedMotion]);

  // Handle manual click to immediately rotate
  const handleClick = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    transitionToNext(false);
  };

  // Subscribe to service updates (when changed across tabs/components)
  useEffect(() => {
    const unsubscribe = subscribeToMissionThought((newThought) => {
      setThought(newThought);
    });

    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);

      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 50);

      return () => {
        clearTimeout(timer);
        mediaQuery.removeEventListener?.('change', listener);
        unsubscribe();
      };
    } else {
      setHasLoaded(true);
      return () => unsubscribe();
    }
  }, []);

  // Automatic dynamic rotation interval
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      transitionToNext(false);
    }, ROTATION_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, transitionToNext]);

  const isVisible = hasLoaded && !isFading;
  const thoughtRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = thoughtRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 7;
    const rotY = ((x - centerX) / centerX) * 7;
    const moveX = ((x - centerX) / centerX) * 10;
    const moveY = ((y - centerY) / centerY) * 10;

    gsap.to(el, {
      rotationX: rotX,
      rotationY: rotY,
      x: moveX,
      y: moveY,
      z: 20,
      scale: 1.02,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    const el = thoughtRef.current;
    if (!el) return;
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      x: 0,
      y: 0,
      z: 0,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  return (
    <div 
      ref={thoughtRef}
      id="astra-mission-thought-hub"
      onClick={handleClick}
      onMouseEnter={() => setIsPaused(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      className="group relative max-w-2xl mx-auto px-4 cursor-pointer flex flex-col items-center justify-center transition-all duration-300"
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      title="Click for next reflection"
      aria-label="Mission Thought"
      aria-live="polite"
    >
      {/* Ambient Celestial Glow (Soft Vibrant Pastel Aura) */}
      <div 
        className="absolute -inset-2 sm:-inset-3 rounded-full bg-gradient-to-r from-cyan-400/15 via-sky-300/20 to-purple-400/15 blur-xl pointer-events-none transition-opacity duration-700 opacity-50 group-hover:opacity-80" 
        aria-hidden="true"
      />

      {/* Liquid Crystal Glass Capsule */}
      <div 
        className="liquid-glass-surface relative z-10 w-full px-5 py-3 sm:px-7 sm:py-3.5 rounded-full border border-white/25 group-hover:border-white/45 transition-all duration-300 flex items-center justify-center"
      >
        
        {/* Subtle luminous beacon dot */}
        <span 
          className="hidden sm:inline-block w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-pulse mr-3.5 shrink-0" 
          aria-hidden="true"
        />

        {/* The High-Contrast Lucrative Quote Line */}
        <blockquote 
          className={`text-center font-sans tracking-wide leading-relaxed transition-all duration-500 ${
            isVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-1 scale-[0.98]'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="text-cyan-200 font-serif text-lg sm:text-2xl mr-1 select-none drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]">“</span>
          <span className="text-base sm:text-lg md:text-xl font-normal bg-gradient-to-r from-white via-cyan-50 to-sky-100 bg-clip-text text-transparent drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)] group-hover:drop-shadow-[0_0_16px_rgba(103,232,249,0.6)]">
            {thought.quote}
          </span>
          <span className="text-cyan-200 font-serif text-lg sm:text-2xl ml-1 select-none drop-shadow-[0_0_12px_rgba(103,232,249,0.8)]">”</span>
        </blockquote>

        {/* Dynamic cycling beacon indicator */}
        <span 
          className="hidden sm:inline-block w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_12px_#38bdf8] animate-pulse ml-3.5 shrink-0" 
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default MissionThought;
