"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CountUpProps {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
  suffix?: string;
}

/** GSAP count up on first scroll into view, mirrors the zip counter blocks. */
export default function CountUp({
  value,
  duration = 1.8,
  format,
  className,
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const render = (n: number) => {
      const text = format ? format(n) : Math.round(n).toLocaleString("en-KE");
      node.textContent = `${text}${suffix}`;
    };
    render(0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || started.current) return;
          started.current = true;
          const state = { val: 0 };
          gsap.to(state, {
            val: value,
            duration,
            ease: "power2.out",
            onUpdate: () => render(state.val),
          });
          observer.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, format, suffix]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
