import React, { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useSafeGsap } from '@/hooks/useSafeGsap';

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  strength?: number;
}

export function MagneticButton({
  children,
  strength = 0.3,
  className = '',
  ...props
}: MagneticButtonProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useSafeGsap(
    () => {
      const el = containerRef.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });

      const handleMouseMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        xTo(deltaX);
        yTo(deltaY);
      };

      const handleMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', handleMouseMove);
      el.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
      };
    },
    { scope: containerRef, dependencies: [strength] }
  );

  return (
    <div ref={containerRef} className={`inline-block ${className}`} {...props}>
      {children}
    </div>
  );
}
