import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPAnimations() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const stocksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate metrics cards
    const metrics = metricsRef.current?.children;
    if (metrics) {
      gsap.from(metrics, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: metricsRef.current,
          start: "top 80%",
        }
      });
    }

    // Animate stock cards with a staggered fade-in and scale effect
    const stocks = stocksRef.current?.children;
    if (stocks) {
      gsap.from(stocks, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: stocksRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return { metricsRef, stocksRef };
}