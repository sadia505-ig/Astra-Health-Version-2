import { useEffect, useRef, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';

export interface UseLocomotiveScrollOptions {
  activeTab?: string;
  enabled?: boolean;
}

export function useLocomotiveScroll({
  activeTab,
  enabled = true,
}: UseLocomotiveScrollOptions = {}) {
  const scrollRef = useRef<LocomotiveScroll | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let locomotive: LocomotiveScroll | null = null;

    try {
      locomotive = new LocomotiveScroll({
        lenisOptions: {
          duration: 1.1,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          syncTouch: false,
          touchMultiplier: 1.4,
          prevent: (node: any) => {
            if (typeof document !== 'undefined' && document.body.style.overflow === 'hidden') return true;
            if (!node || typeof node.closest !== 'function') return false;
            return Boolean(
              node.closest('[data-lenis-prevent]') ||
              node.closest('[data-scroll-prevent]') ||
              node.closest('#mission-command-matrix-overlay') ||
              node.closest('#mission-command-matrix-modal') ||
              node.closest('.overflow-y-auto') ||
              node.closest('.fixed.inset-0')
            );
          },
        },
      });

      scrollRef.current = locomotive;

      // Track scroll progress for orbital telemetry HUD
      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
          const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
          setScrollProgress(progress);
        } else {
          setScrollProgress(0);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
        try {
          locomotive?.destroy();
        } catch {
          // Ignore destruction race conditions
        }
        scrollRef.current = null;
      };
    } catch (err) {
      console.warn('LocomotiveScroll init warning:', err);
    }
  }, [enabled]);

  // Recalculate layout dimensions whenever the active tab / view changes
  useEffect(() => {
    if (scrollRef.current) {
      const timer = setTimeout(() => {
        try {
          scrollRef.current?.resize();
        } catch {
          // ignore resize errors
        }
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const scrollTo = (target: string | HTMLElement | number, options?: any) => {
    if (scrollRef.current) {
      try {
        scrollRef.current.scrollTo(target, options);
      } catch {
        if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else if (typeof target === 'string') {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return {
    scrollInstance: scrollRef.current,
    scrollProgress,
    scrollTo,
  };
}
