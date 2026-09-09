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
  const staticMediaQuery = "(prefers-reduced-motion: reduce)";

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const staticQuery = window.matchMedia(staticMediaQuery);
    let frame = 0;
    let disposed = false;
    let previousChapter = -1;

    const update = () => {
      frame = 0;
      if (disposed) return;
      const isStatic = staticQuery.matches;
      root.dataset.motion = isStatic ? "static" : "scroll";
      root.dataset.layout = isStatic ? "flow" : "chapters";
      const rect = root.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height - stage.offsetHeight));
      root.dataset.progress = String(progress);
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
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      frame = 0;
      root.style.setProperty("--pointer-x", String(x));
      root.style.setProperty("--pointer-y", String(y));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const reset = () => { x = 0; y = 0; schedule(); };
    const modeChanged = () => {
      root.dataset.pointer = finePointer.matches && !reduced.matches ? "enabled" : "off";
      reset();
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || reduced.matches || event.pointerType === "touch") return;
      const rect = stage.getBoundingClientRect();
      x = clamp((event.clientX - rect.left) / Math.max(1, rect.width) * 2 - 1, -1, 1);
      y = clamp((event.clientY - rect.top) / Math.max(1, rect.height) * 2 - 1, -1, 1);
      schedule();
    };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    finePointer.addEventListener("change", modeChanged);
    reduced.addEventListener("change", modeChanged);
    modeChanged();
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      finePointer.removeEventListener("change", modeChanged);
      reduced.removeEventListener("change", modeChanged);
    };
  }, []);

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

            <div className="parallax-intro">
              <p className="parallax-eyebrow"><span />{hero.badge}</p>
              <h1><span>{hero.displayNameTop}</span><strong>{hero.displayNameAccent}<i>.</i></strong></h1>
            </div>

            <div className="parallax-portrait">
              <figure className="portrait-pointer">
              <Image src={`${basePath}/eacon-portrait.jpg`} alt={hero.portraitAlt} width={1086} height={1448}
                priority sizes="(min-width: 768px) 40vw, 100vw" />
              <figcaption><strong>{hero.primaryName}</strong><span>{hero.profileLabel}</span></figcaption>
              </figure>
            </div>

            <div className="parallax-story">
              <p className="parallax-eyebrow">02 / {isEnglish ? "FROM NEED TO DELIVERY" : "从需求到交付"}</p>
              <h2><span>{isEnglish ? "From real needs." : "把真实需求，"}</span><em>{isEnglish ? "To real outcomes." : "推进到交付。"}</em></h2>
            </div>
            <div className="parallax-methods" aria-label={isEnglish ? "Working process" : "工作流程"}>
              {hero.floatingLabels.map((label, index) => (
                <div className="parallax-method" key={label} data-step={index + 1}>
                  <b>0{index + 1}</b><span>{label}</span>
                </div>
              ))}
            </div>

            <div className="parallax-roles">
              <p className="parallax-eyebrow">03 / {hero.focusLabel}</p>
              <h2>{isEnglish ? <>AI Operations.<br /><em>Built for delivery.</em></> : <>AI 应用运营<br /><em>与交付。</em></>}</h2>
              <p className="parallax-footnote">{hero.profileFootnote}</p>
            </div>

            <div className="parallax-bottom">
              <div className="parallax-actions">
                <a href="#experience" className="parallax-primary">{isEnglish ? "Experience" : hero.ctaExperience}<ArrowDown size={16} aria-hidden="true" /></a>
                <a href="#projects">{isEnglish ? "Projects" : hero.ctaProjects}<ArrowUpRight size={16} aria-hidden="true" /></a>
                <a href={`mailto:${person.email}`} className="parallax-email" aria-label={hero.ctaContact}><Mail size={18} aria-hidden="true" /></a>
              </div>
              <a className="parallax-skip" href="#about"><span className="scroll-hint">{isEnglish ? "Scroll to explore" : "向下滚动，开始探索"}</span><span className="pointer-hint">{isEnglish ? "Move your cursor to explore" : "移动鼠标，探索空间"}</span><ArrowDown size={15} aria-hidden="true" /></a>
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
