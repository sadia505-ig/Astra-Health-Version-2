import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface UseGsapModuleTransitionsOptions {
  scopeId?: string;
}

/**
 * GSAP ScrollTrigger & 3D Cursor Tilt Hook for Module Pages (Bio Signal & Neural Signal)
 * - Implements sliding entrance transitions while scrolling down (alternating left/right 3D perspective)
 * - Implements 3D magnetic cursor tilt on all interactive boxes
 */
export function useGsapModuleTransitions(
  containerRef: React.RefObject<HTMLDivElement | null>,
  options: UseGsapModuleTransitionsOptions = {}
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Initial Top Header 3D Entrance
      gsap.fromTo(
        '.module-top-header',
        { opacity: 0, y: -25, scale: 0.98, filter: 'blur(6px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out' }
      );

      // 2. Sliding Effect & Appearing Transition While Scrolling Down
      if (!prefersReducedMotion) {
        const slideBoxes = gsap.utils.toArray<HTMLElement>('.gsap-slide-box');
        slideBoxes.forEach((box, i) => {
          const isLeft = i % 2 === 0;
          gsap.fromTo(
            box,
            {
              x: isLeft ? -45 : 45,
              rotationY: isLeft ? -8 : 8,
              opacity: 0.2,
              scale: 0.95,
              transformPerspective: 1000,
            },
            {
              scrollTrigger: {
                trigger: box,
                start: 'top 92%',
                end: 'top 65%',
                scrub: 1.0,
              },
              x: 0,
              rotationY: 0,
              opacity: 1,
              scale: 1,
              ease: 'power3.out',
            }
          );
        });

        // 3. Staggered Appearing Transition for Vital Navy Tiles
        const vitalTiles = gsap.utils.toArray<HTMLElement>('.vital-navy-box');
        vitalTiles.forEach((tile) => {
          gsap.fromTo(
            tile,
            { scale: 0.94, opacity: 0.4 },
            {
              scrollTrigger: {
                trigger: tile,
                start: 'top 95%',
                end: 'top 75%',
                scrub: 0.8,
              },
              scale: 1,
              opacity: 1,
              ease: 'back.out(1.4)',
            }
          );
        });
      }

      // 4. Cursor 3D Tilting Effect on all Interactive Boxes
      const tiltCards = gsap.utils.toArray<HTMLElement>('.tilt-box');
      const cleanupFns: Array<() => void> = [];

      tiltCards.forEach((card) => {
        card.style.transformStyle = 'preserve-3d';
        card.style.perspective = '1000px';

        const onMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotX = -((y - centerY) / centerY) * 6;
          const rotY = ((x - centerX) / centerX) * 6;
          const moveX = ((x - centerX) / centerX) * 5;
          const moveY = ((y - centerY) / centerY) * 5;

          gsap.to(card, {
            rotationX: rotX,
            rotationY: rotY,
            x: moveX,
            y: moveY,
            scale: 1.012,
            z: 12,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            x: 0,
            y: 0,
            scale: 1,
            z: 0,
            duration: 0.5,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);

        cleanupFns.push(() => {
          card.removeEventListener('mousemove', onMouseMove);
          card.removeEventListener('mouseleave', onMouseLeave);
        });
      });

      return () => {
        cleanupFns.forEach((fn) => fn());
      };
    }, container);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [containerRef]);
}
