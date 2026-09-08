"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import type { Language, localizedProfile } from "@/lib/profile-data";
import { clamp, heroFrame } from "@/lib/parallax";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
type LocalizedProfile = (typeof localizedProfile)[Language];

type HeroProps = { profile: LocalizedProfile; language: Language };

export function Hero({ profile, language }: HeroProps) {
  const { hero, heroKeywords, person } = profile;
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isEnglish = language === "en";

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const staticQuery = window.matchMedia("(prefers-reduced-motion: reduce), (max-height: 640px), (max-width: 359px)" + (language === "en" ? ", (max-width: 767px) and (max-height: 800px)" : ""));
    let frame = 0;
    let disposed = false;
    let previousChapter = -1;

    const update = () => {
      frame = 0;
      if (disposed) return;
      const isStatic = staticQuery.matches;
      root.dataset.motion = isStatic ? "static" : "scroll";
      const rect = root.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
      const state = heroFrame(progress);
      for (const [name, value] of Object.entries(state.styles)) root.style.setProperty(name, value);
      if (state.chapter !== previousChapter || isStatic) {
        root.dataset.chapter = String(state.chapter);
        previousChapter = state.chapter;
      }

    };
    const schedule = () => { if (!disposed && !frame) frame = window.requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(root);
    observer.observe(stage);
    staticQuery.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.fonts.ready.then(schedule);
    update();
    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      staticQuery.removeEventListener("change", schedule);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [language]);

  return (
    <>
    <section id="top" ref={rootRef} className="parallax-hero" data-language={language} aria-label={hero.primaryName}>
      <div ref={stageRef} className="parallax-stage">
        <div className="parallax-clip">
          <div className="parallax-word" aria-hidden="true">EACON JING.</div>
          <div className="parallax-rule" aria-hidden="true" />
          <div className="section-shell parallax-shell">
            <div className="parallax-edition">
              <span>{hero.editionLabel}</span>
              <span>{hero.disciplineLabel}</span>
              <span>{hero.locationLabel}</span>
            </div>

            <div className="parallax-portrait">
              <figure className="parallax-photo">
                <Image src={`${basePath}/eacon-portrait.jpg`} alt={hero.portraitAlt} width={1086} height={1448}
                  priority sizes="(min-width: 1024px) 42vw, 70vw" />
                <figcaption><span>{hero.profileLabel}</span><span>{hero.portraitBadge}</span></figcaption>
              </figure>
              <span className="parallax-photo-index" aria-hidden="true">01 — EJ</span>
            </div>

            <div className="parallax-intro">
              <p className="parallax-eyebrow"><span />{hero.badge}</p>
              <h1><span>{hero.displayNameTop}</span><strong>{hero.displayNameAccent}<i>.</i></strong></h1>
              <p className="parallax-subtitle">{person.subtitle}</p>
              <p className="parallax-location">{person.location}</p>
            </div>

            <div className="parallax-story">
              <p className="parallax-eyebrow">02 / {isEnglish ? "FROM NEED TO DELIVERY" : "从需求到交付"}</p>
              <h2>{hero.leadStart}<em>{hero.leadAccentOne}</em>{hero.leadMiddle}{hero.leadAccentTwo}{hero.leadEnd}</h2>
              <p className="parallax-body">{hero.body}</p>
              <div className="parallax-methods">{hero.floatingLabels.map((label, index) => (
                <span key={label}><b>0{index + 1}</b>{label}</span>
              ))}</div>
            </div>

            <div className="parallax-roles">
              <p className="parallax-eyebrow">03 / {hero.focusLabel}</p>
              <h2>{person.title}<span>.</span></h2>
              <div className="parallax-role-list">{hero.focusText.split(" · ").map((role) => <span key={role}>{role}</span>)}</div>
              <p className="parallax-footnote">{hero.profileFootnote}</p>
            </div>

            <div className="parallax-bottom">
              <div className="parallax-actions">
                <a href="#experience" className="parallax-primary">{hero.ctaExperience}<ArrowDown size={16} aria-hidden="true" /></a>
                <a href="#projects">{hero.ctaProjects}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <a href={`mailto:${person.email}`} className="parallax-email" aria-label={hero.ctaContact}><Mail size={18} aria-hidden="true" /></a>
              </div>
              <a className="parallax-skip" href="#about">{isEnglish ? "Explore profile" : "向下探索履历"}<ArrowDown size={15} aria-hidden="true" /></a>
              <div className="parallax-progress" aria-hidden="true"><span className="parallax-chapter"><b>01</b><b>02</b><b>03</b></span><i><span /></i><span>03</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
      <div className="parallax-keywords"><div className="section-shell">{heroKeywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div></div>
    </>
  );
}
