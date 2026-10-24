import React from 'react';
import { ArrowUp, Compass } from 'lucide-react';
import { spaceAudio } from '../../utils/spaceAudio';

interface OrbitalScrollHUDProps {
  progress: number;
  onScrollToTop: () => void;
}

export const OrbitalScrollHUD: React.FC<OrbitalScrollHUDProps> = ({
  progress,
  onScrollToTop,
}) => {
  // Only show when the page has meaningful scroll room and user has scrolled slightly
  const isScrolled = progress > 3;

  // Calculate dynamic orbital altitude based on scroll position (418km apogee -> 405km perigee)
  const currentAltitude = Math.round(418 - (progress / 100) * 13);

  const handleClickTop = () => {
    spaceAudio.playQuindar();
    onScrollToTop();
  };

  return (
    <div 
      className={`flight-scroll-hud transition-all duration-500 hidden sm:flex ${
        isScrolled ? 'opacity-100 translate-x-0' : 'opacity-40 translate-x-1 hover:opacity-90'
      }`}
      title={`Orbital Altitude: ${currentAltitude} km (${Math.round(progress)}%)`}
    >
      {/* Top Altitude Tag */}
      <div className="flex flex-col items-center gap-0.5 text-[9px] font-mono text-cyan-400 select-none bg-slate-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30 backdrop-blur-xs shadow-sm">
        <Compass className="w-2.5 h-2.5 text-cyan-300 animate-spin" style={{ animationDuration: '30s' }} />
        <span className="font-bold tracking-tighter">{currentAltitude}K</span>
      </div>

      {/* Vertical Telemetry Track & Thumb */}
      <div 
        className="flight-scroll-indicator cursor-pointer"
        onClick={() => {
          // Clicking anywhere on track scrolls to proportional position
          window.scrollTo({
            top: (document.documentElement.scrollHeight - window.innerHeight) * (progress / 100),
            behavior: 'smooth'
          });
        }}
      >
        <div 
          className="flight-scroll-thumb"
          style={{ height: `${Math.max(8, progress)}%` }}
        />
      </div>

      {/* Quick Ascent Button */}
      {isScrolled && (
        <button
          type="button"
          onClick={handleClickTop}
          className="p-1 rounded-full bg-slate-950/80 hover:bg-cyan-950 border border-cyan-500/40 hover:border-cyan-300 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-md hover:scale-110 active:scale-95 group"
          title="Ascend to orbital apex (Scroll to top)"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};
