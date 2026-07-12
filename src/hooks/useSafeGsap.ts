import React from 'react';
import { useGSAP } from '@gsap/react';

interface UseSafeGsapOptions {
  scope?: React.RefObject<Element | null> | Element | string;
  dependencies?: unknown[];
}

/**
 * A safe wrapper around useGSAP that checks prefers-reduced-motion
 */
export function useSafeGsap(
  callback: (context: gsap.Context) => void | (() => void),
  options: UseSafeGsapOptions = {}
) {
  const { scope, dependencies = [] } = options;

  useGSAP(
    (context) => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (prefersReducedMotion) {
        return;
      }

      return callback(context);
    },
    { scope, dependencies }
  );
}
