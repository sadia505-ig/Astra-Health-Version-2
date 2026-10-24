import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface UseGsapProjectTransitionsOptions {
  activeTab: string;
}

export function useGsapProjectTransitions({ activeTab }: UseGsapProjectTransitionsOptions) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Synchronize ScrollTrigger with window scrolling
    const handleScrollSync = () => {
      ScrollTrigger.update();
    };
    window.addEventListener('scroll', handleScrollSync, { passive: true });

    // Scope all GSAP animations within a clean context
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      if (!container) return;

      // 1. 3D View Transition when navigating between tabs
      gsap.fromTo(
        container,
        {
          opacity: 0,
          rotationY: 4.5,
          z: -50,
          scale: 0.985,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          rotationY: 0,
          z: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
        }
      );

      // 2. 3D Staggered Cascade for Cards and Modules across the current view
      const cards = container.querySelectorAll<HTMLElement>(
        '.gsap-card, .metric-card, .liquid-glass-card, [id^="metric-card-"], section > .rounded-xl, section > .rounded-2xl'
      );

      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 25,
            z: -35,
            rotationX: 8,
            scale: 0.96,
            transformPerspective: 1000,
          },
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.55,
            stagger: {
              each: 0.04,
              from: 'start',
            },
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          }
        );
      }

      // 3. ScrollTrigger 3D Reveals for Content Down the Page
      const scrollSections = container.querySelectorAll<HTMLElement>(
        'section, .gsap-scroll-reveal, [data-scroll-section]'
      );

      scrollSections.forEach((section) => {
        // Skip elements already in the initial viewport
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight) return;

        gsap.fromTo(
          section,
          {
            opacity: 0,
            y: 35,
            rotationX: 6,
            scale: 0.97,
            transformPerspective: 1000,
          },
          {
            scrollTrigger: {
              trigger: section,
              start: 'top bottom-=60',
              end: 'top center+=100',
              toggleActions: 'play none none none',
            },
            opacity: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'opacity,transform',
          }
        );
      });

      // 4. Interactive 3D Magnetic Cursor Tilt on all interactive cards
      const interactiveCards = container.querySelectorAll<HTMLElement>(
        '.gsap-card, .metric-card, [id^="metric-card-"], .interactive-3d'
      );

      interactiveCards.forEach((card) => {
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

          gsap.to(card, {
            rotationX: rotX,
            rotationY: rotY,
            z: 16,
            scale: 1.015,
            duration: 0.35,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        const onMouseLeave = () => {
          gsap.to(card, {
            rotationX: 0,
            rotationY: 0,
            z: 0,
            scale: 1,
            duration: 0.45,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        };

        card.addEventListener('mousemove', onMouseMove);
        card.addEventListener('mouseleave', onMouseLeave);

        // Store listeners for cleanup
        (card as any)._gsapCleanup = () => {
          card.removeEventListener('mousemove', onMouseMove);
          card.removeEventListener('mouseleave', onMouseLeave);
        };
      });
    }, containerRef);

    return () => {
      window.removeEventListener('scroll', handleScrollSync);
      const container = containerRef.current;
      if (container) {
        const interactiveCards = container.querySelectorAll<HTMLElement>(
          '.gsap-card, .metric-card, [id^="metric-card-"], .interactive-3d'
        );
        interactiveCards.forEach((card) => {
          if ((card as any)._gsapCleanup) {
            (card as any)._gsapCleanup();
          }
        });
      }
      ctx.revert();
    };
  }, [activeTab]);

  return { containerRef };
}
