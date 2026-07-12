import React, { useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useSafeGsap } from '@/hooks/useSafeGsap';

interface CountUpStatProps {
  targetValue: string | number;
  className?: string;
}

export function CountUpStat({ targetValue, className = '' }: CountUpStatProps): React.JSX.Element {
  const spanRef = useRef<HTMLSpanElement>(null);

  useSafeGsap(
    () => {
      const el = spanRef.current;
      if (!el) return;

      const rawStr = String(targetValue);
      const cleanNumStr = rawStr.replace(/[^0-9.-]+/g, '');
      const num = parseFloat(cleanNumStr);

      if (isNaN(num)) {
        el.textContent = rawStr;
        return;
      }

      const prefixMatch = rawStr.match(/^([^0-9.-]+)/);
      const suffixMatch = rawStr.match(/([^0-9.-]+)$/);
      const prefix = prefixMatch ? prefixMatch[1] : '';
      const suffix = suffixMatch ? suffixMatch[1] : '';

      const decimalParts = cleanNumStr.split('.');
      const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
      const useCommas = rawStr.includes(',');

      const counter = { val: 0 };

      gsap.to(counter, {
        val: num,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 95%',
          once: true,
        },
        onUpdate: () => {
          let formatted = counter.val.toFixed(decimals);
          if (useCommas && decimals === 0) {
            formatted = Math.round(counter.val).toLocaleString();
          } else if (useCommas && decimals > 0) {
            const parts = formatted.split('.');
            parts[0] = parseInt(parts[0], 10).toLocaleString();
            formatted = parts.join('.');
          }
          el.textContent = `${prefix}${formatted}${suffix}`;
        },
      });
    },
    { scope: spanRef, dependencies: [targetValue] }
  );

  return (
    <span ref={spanRef} className={className}>
      {targetValue}
    </span>
  );
}
