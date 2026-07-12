import React, { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useSafeGsap } from '@/hooks/useSafeGsap';

interface AnimatedWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedWrapper({
  children,
  delay = 0,
  className = '',
  ...props
}: AnimatedWrapperProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useSafeGsap(
    () => {
      if (!containerRef.current) return;
      gsap.set(containerRef.current, { opacity: 0, y: 30, scale: 0.98 });
      gsap.to(containerRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        delay,
      });
    },
    { scope: containerRef, dependencies: [delay] }
  );

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  );
}
