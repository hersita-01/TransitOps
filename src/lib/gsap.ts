import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

// Set default ease
gsap.defaults({
  ease: 'power3.out',
});

export { gsap, useGSAP, ScrollTrigger };
