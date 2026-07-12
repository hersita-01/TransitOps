import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from '@/lib/gsap';
import { useSafeGsap } from '@/hooks/useSafeGsap';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useSafeGsap(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    },
    { scope: containerRef, dependencies: [location.pathname] }
  );

  return (
    <div ref={containerRef} className="w-full">
      {children}
    </div>
  );
}
