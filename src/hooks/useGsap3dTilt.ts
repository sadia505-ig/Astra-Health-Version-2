import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export function useGsap3dTilt<T extends HTMLElement>() {
  const elementRef = useRef<T | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Set initial 3D transform properties
    gsap.set(el, {
      transformPerspective: 1000,
      transformStyle: 'preserve-3d',
    });

    // Create high-performance quickTo physics interpolators
    const setRotX = gsap.quickTo(el, 'rotationX', { duration: 0.4, ease: 'power2.out' });
    const setRotY = gsap.quickTo(el, 'rotationY', { duration: 0.4, ease: 'power2.out' });
    const setZ = gsap.quickTo(el, 'z', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Realistic 3D tilt calculation
      const rotX = -((y - centerY) / centerY) * 7.5;
      const rotY = ((x - centerX) / centerX) * 7.5;

      setRotX(rotX);
      setRotY(rotY);
      setZ(18);
    };

    const handleMouseLeave = () => {
      setRotX(0);
      setRotY(0);
      setZ(0);
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return elementRef;
}
