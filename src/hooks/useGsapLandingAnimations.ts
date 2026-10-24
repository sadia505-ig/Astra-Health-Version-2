import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGsapLandingAnimations(containerRef: React.RefObject<HTMLDivElement | null>) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Create a safe GSAP Context scoped to the container
    const ctx = gsap.context(() => {
      // ============================================================
      // 1. INITIAL 3D ENTRANCE (When entering landing page)
      // ============================================================
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // Top identity strip
      tl.fromTo(
        '#landing-identity-strip',
        { opacity: 0, y: -20, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }
      );

      // AstraHealth Welcome Banner entrance (permanent crisp visibility)
      tl.fromTo(
        '#astrahealth-welcome-banner',
        {
          opacity: 0,
          y: 28,
          scale: 0.98,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'opacity',
        },
        '-=0.4'
      );

      // Mission Thought capsule elastic pop
      tl.fromTo(
        '#astra-mission-thought-hub',
        { opacity: 0, scale: 0.85, y: 22 },
        { opacity: 1, scale: 1, y: 0, duration: 0.75, ease: 'back.out(1.8)' },
        '-=0.5'
      );

      // ============================================================
      // 2. SCROLL-OUT DISAPPEARING EFFECT (Upper Part)
      // "when i scroll down the upper part should look like disapppearing"
      // ============================================================
      gsap.to(['#landing-identity-strip', '#landing-upper-hero'], {
        scrollTrigger: {
          trigger: '#landing-upper-hero',
          start: 'top top+=60',
          end: 'bottom top+=40',
          scrub: 1.1,
        },
        opacity: 0,
        y: -75,
        scale: 0.92,
        filter: 'blur(8px)',
        pointerEvents: 'none',
        ease: 'power2.in',
      });

      // ============================================================
      // 3. SCROLL-IN TRANSITION LANDING FROM LEFT & RIGHT SIDES
      // "while scrolling down the icons and boxes should transition landing from left or right side"
      // ============================================================

      // Left-side boxes transition landing from the LEFT side
      const leftCards = gsap.utils.toArray<HTMLElement>('.landing-card-left');
      leftCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            x: -80,
            rotationY: -14,
            z: -40,
            opacity: 0.2,
            scale: 0.94,
            transformPerspective: 1000,
          },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 60%',
              scrub: 1.0,
            },
            x: 0,
            rotationY: 0,
            z: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
          }
        );

        // Icon inside left card lands with dynamic spin & spring
        const icon = card.querySelector<HTMLElement>('.landing-card-icon');
        if (icon) {
          gsap.fromTo(
            icon,
            { x: -35, rotation: -25, scale: 0.7, opacity: 0.3 },
            {
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 60%',
                scrub: 1.0,
              },
              x: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              ease: 'back.out(2)',
            }
          );
        }
      });

      // Right-side boxes transition landing from the RIGHT side
      const rightCards = gsap.utils.toArray<HTMLElement>('.landing-card-right');
      rightCards.forEach((card) => {
        gsap.fromTo(
          card,
          {
            x: 80,
            rotationY: 14,
            z: -40,
            opacity: 0.2,
            scale: 0.94,
            transformPerspective: 1000,
          },
          {
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 60%',
              scrub: 1.0,
            },
            x: 0,
            rotationY: 0,
            z: 0,
            opacity: 1,
            scale: 1,
            ease: 'power3.out',
          }
        );

        // Icon inside right card lands with dynamic spin & spring
        const icon = card.querySelector<HTMLElement>('.landing-card-icon');
        if (icon) {
          gsap.fromTo(
            icon,
            { x: 35, rotation: 25, scale: 0.7, opacity: 0.3 },
            {
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 60%',
                scrub: 1.0,
              },
              x: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,
              ease: 'back.out(2)',
            }
          );
        }
      });

      // Earth Observation Window Reticle 3D Rotation & Expansion
      gsap.fromTo(
        '.gsap-earth-window-reticle',
        {
          scale: 0.75,
          opacity: 0.4,
          rotationZ: -30,
        },
        {
          scrollTrigger: {
            trigger: '.gsap-earth-window-reticle',
            start: 'top bottom',
            end: 'center center',
            scrub: 1.5,
          },
          scale: 1.1,
          opacity: 1,
          rotationZ: 45,
          ease: 'power2.out',
        }
      );

      // Microgravity subtle floating levitation on cards
      const allCards = gsap.utils.toArray<HTMLElement>('.gsap-3d-card');
      allCards.forEach((card, i) => {
        gsap.to(card, {
          y: '+=5',
          rotationZ: i % 2 === 0 ? 0.35 : -0.35,
          duration: 4.5 + i * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.25,
        });
      });
    }, container);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    ctxRef.current = ctx;

    return () => {
      clearTimeout(timer);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [containerRef]);

  return ctxRef;
}
