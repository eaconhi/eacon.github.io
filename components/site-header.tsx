"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { navItems, person } from "@/lib/profile-data";

export function SiteHeader() {
  const [active, setActive] = useState("#about");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full border px-2 pl-3 transition-all duration-500 ${
            scrolled
              ? "border-black/[0.10] bg-white/[0.82] shadow-[0_18px_70px_rgba(5,5,5,0.10)] backdrop-blur-xl"
              : "border-black/[0.08] bg-white/[0.62] backdrop-blur-md"
          }`}
        >
          <a href="#top" className="group flex items-center gap-3 rounded-full pr-2" aria-label="Back to top">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-semibold text-white ring-1 ring-black/[0.08]">
              EJ
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-sm font-semibold text-black">{person.englishName}</span>
              <span className="block text-[11px] text-black/[0.50]">{person.chineseName} / {person.alias}</span>
            </span>
          </a>

          <nav className="hidden items-center rounded-full bg-black/[0.035] p-1 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive = active === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-500 ${
                    isActive
                      ? "bg-black text-white shadow-[0_8px_28px_rgba(5,5,5,0.18)]"
                      : "text-black/[0.58] hover:bg-white hover:text-black"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="ml-1 text-[10px] opacity-60">{item.english}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-black/[0.10] px-3 py-2 text-[11px] font-semibold text-black/[0.58] lg:inline-flex">
              CN / EN
            </span>
            <a
              href={`mailto:${person.email}`}
              className="magnetic-button hidden h-10 items-center gap-2 rounded-full bg-black px-4 text-xs font-semibold text-white hover:bg-[#111] sm:inline-flex"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              联系
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.10] text-black lg:hidden"
            >
              {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav className="mt-3 rounded-[28px] border border-black/[0.10] bg-white/[0.92] p-2 shadow-[0_18px_60px_rgba(5,5,5,0.10)] backdrop-blur-xl lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-full px-4 py-3 text-sm font-semibold text-black/[0.72] hover:bg-black hover:text-white"
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
