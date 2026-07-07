"use client";

import { useEffect } from "react";

type ScrollEffectsProps = {
  watchKey?: string;
};

export function ScrollEffects({ watchKey }: ScrollEffectsProps) {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    if (prefersReduced) {
      revealItems.forEach((item) => item.setAttribute("data-visible", "true"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-visible", "true");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    return () => revealObserver.disconnect();
  }, [watchKey]);

  useEffect(() => {
    const timeline = document.querySelector<HTMLElement>("[data-timeline]");
    if (!timeline) return;

    const update = () => {
      const rect = timeline.getBoundingClientRect();
      const viewport = window.innerHeight;
      const total = rect.height + viewport * 0.5;
      const travelled = viewport * 0.58 - rect.top;
      const progress = Math.max(0, Math.min(1, travelled / total));
      document.documentElement.style.setProperty("--timeline-progress", `${progress * 100}%`);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return null;
}
