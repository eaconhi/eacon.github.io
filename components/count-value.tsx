"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CountValueProps = {
  value: string;
};

function parseValue(value: string) {
  const match = value.match(/([\d,]+)/);
  if (!match) return null;
  return {
    target: Number(match[1].replace(/,/g, "")),
    prefix: value.slice(0, match.index),
    suffix: value.slice((match.index ?? 0) + match[1].length)
  };
}

export function CountValue({ value }: CountValueProps) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(parsed ? "0" : value);

  useEffect(() => {
    if (!parsed || !ref.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const duration = 1200;
        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const number = Math.round(parsed.target * eased).toLocaleString("en-US");
          setDisplay(`${parsed.prefix}${number}${parsed.suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.unobserve(node);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [parsed, value]);

  return <span ref={ref}>{display}</span>;
}
