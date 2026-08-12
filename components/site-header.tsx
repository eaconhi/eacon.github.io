"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import type { Language, localizedProfile } from "@/lib/profile-data";

type LocalizedProfile = (typeof localizedProfile)[Language];

type SiteHeaderProps = {
  language: Language;
  navItems: LocalizedProfile["navItems"];
  person: LocalizedProfile["person"];
  copy: LocalizedProfile["header"];
  onLanguageChange: (language: Language) => void;
};

export function SiteHeader({ language, navItems, person, copy, onLanguageChange }: SiteHeaderProps) {
  const [active, setActive] = useState("#about");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const nextLanguage: Language = language === "zh" ? "en" : "zh";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = navItems
      .map((item) => document.querySelector(item.href))
      .filter((item): item is Element => Boolean(item));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0.12, 0.3, 0.6] }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 pt-4">
      <div className="section-shell">
        <div
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between border-2 border-black px-2 pl-2 transition-all duration-500 ${
            scrolled
              ? "bg-white shadow-[6px_6px_0_#050505]"
              : "bg-[#f5f4ef]/95 backdrop-blur-md"
          }`}
        >
          <a href="#top" className="group flex items-center gap-3 pr-2" aria-label={copy.backToTop}>
            <span className="flex h-9 w-9 items-center justify-center bg-black text-xs font-semibold text-white">
              EJ
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold text-black">{person.englishName}</span>
              <span className="block text-[11px] text-black/[0.50]">{copy.brandSubline}</span>
            </span>
          </a>

          <nav className="hidden items-center border-x border-black/[0.12] lg:flex" aria-label={copy.navAria}>
            {navItems.map((item) => {
              const isActive = active === item.href;
              const secondary = item.english && item.english !== item.label ? item.english : "";
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-black text-white"
                      : "text-black/[0.58] hover:bg-[#ff4f18] hover:text-black"
                  }`}
                >
                  <span>{item.label}</span>
                  {secondary ? <span className="ml-1 text-[10px] opacity-60">{secondary}</span> : null}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onLanguageChange(nextLanguage)}
              aria-label={copy.languageToggleAria}
              className="hidden border border-black px-3 py-2 text-[11px] font-semibold text-black transition-colors hover:bg-[#ffcc00] lg:inline-flex"
            >
              {copy.languageToggle}
            </button>
            <a
              href={`mailto:${person.email}`}
              className="hidden h-10 items-center gap-2 border-2 border-black bg-[#ff4f18] px-4 text-xs font-semibold text-black shadow-[3px_3px_0_#050505] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] sm:inline-flex"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {copy.contact}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              aria-label={open ? copy.menuClose : copy.menuOpen}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center border border-black text-black lg:hidden"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="mt-3 border-2 border-black bg-[#f5f4ef] p-2 shadow-[6px_6px_0_#050505] lg:hidden">
            <button
              type="button"
              onClick={() => {
                onLanguageChange(nextLanguage);
                setOpen(false);
              }}
              className="mb-1 flex w-full items-center justify-between border border-black bg-[#ffcc00] px-4 py-3 text-sm font-semibold text-black"
            >
              {copy.languageToggle}
              <span className="text-xs opacity-55">{language === "zh" ? "English" : "Chinese"}</span>
            </button>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-t border-black px-4 py-3 text-sm font-semibold text-black/[0.72] hover:bg-black hover:text-white"
              >
                {item.label}
                <span className="text-xs opacity-55">{item.english}</span>
              </a>
            ))}
          </nav>
        ) : null}
      </div>
    </header>
  );
}
