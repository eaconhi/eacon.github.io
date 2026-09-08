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
    const tracks = Array.from(document.querySelectorAll<HTMLElement>(".marquee-track"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (timeline) {
        const rect = timeline.getBoundingClientRect();
        const viewport = window.innerHeight;
        const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, (viewport * 0.58 - rect.top) / (rect.height + viewport * 0.5)));
        document.documentElement.style.setProperty("--timeline-progress", `${progress * 100}%`);
      }
      tracks.forEach((track) => {
        const half = track.scrollWidth / 2;
        const offset = reduced.matches || !half ? 0 : (window.scrollY * 0.12) % half;
        track.style.setProperty("--scroll-offset", `${-offset}px`);
      });
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    if (timeline) observer.observe(timeline);
    tracks.forEach((track) => observer.observe(track));
    update();
    reduced.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [watchKey]);

  return null;
}
